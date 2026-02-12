import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import os
from PIL import Image
import glob

# --- CONFIG ---
IMG_SIZE = 256
BATCH_SIZE = 1
EPOCHS = 10  # Increase for better results (50-200)
DATASET_PATH = "data/training/maps/train"  # Your dataset folder
OUTPUT_PATH = "models/pix2pix_generator.h5"

# --- GENERATOR (U-Net) ---
def build_generator():
    inputs = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    
    # Encoder
    down1 = layers.Conv2D(64, 4, strides=2, padding='same')(inputs)
    down1 = layers.LeakyReLU()(down1)
    
    down2 = layers.Conv2D(128, 4, strides=2, padding='same')(down1)
    down2 = layers.BatchNormalization()(down2)
    down2 = layers.LeakyReLU()(down2)
    
    down3 = layers.Conv2D(256, 4, strides=2, padding='same')(down2)
    down3 = layers.BatchNormalization()(down3)
    down3 = layers.LeakyReLU()(down3)
    
    down4 = layers.Conv2D(512, 4, strides=2, padding='same')(down3)
    down4 = layers.BatchNormalization()(down4)
    down4 = layers.LeakyReLU()(down4)
    
    # Decoder
    up1 = layers.Conv2DTranspose(256, 4, strides=2, padding='same')(down4)
    up1 = layers.BatchNormalization()(up1)
    up1 = layers.Dropout(0.5)(up1)
    up1 = layers.ReLU()(up1)
    up1 = layers.Concatenate()([up1, down3])
    
    up2 = layers.Conv2DTranspose(128, 4, strides=2, padding='same')(up1)
    up2 = layers.BatchNormalization()(up2)
    up2 = layers.Dropout(0.5)(up2)
    up2 = layers.ReLU()(up2)
    up2 = layers.Concatenate()([up2, down2])
    
    up3 = layers.Conv2DTranspose(64, 4, strides=2, padding='same')(up2)
    up3 = layers.BatchNormalization()(up3)
    up3 = layers.ReLU()(up3)
    up3 = layers.Concatenate()([up3, down1])
    
    up4 = layers.Conv2DTranspose(3, 4, strides=2, padding='same', activation='tanh')(up3)
    
    return keras.Model(inputs=inputs, outputs=up4)

# --- DISCRIMINATOR (PatchGAN) ---
def build_discriminator():
    input_img = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    target_img = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    
    combined = layers.Concatenate()([input_img, target_img])
    
    x = layers.Conv2D(64, 4, strides=2, padding='same')(combined)
    x = layers.LeakyReLU()(x)
    
    x = layers.Conv2D(128, 4, strides=2, padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU()(x)
    
    x = layers.Conv2D(256, 4, strides=2, padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU()(x)
    
    x = layers.Conv2D(1, 4, padding='same')(x)
    
    return keras.Model(inputs=[input_img, target_img], outputs=x)

# --- LOAD DATA ---
def load_images(folder):
    images = []
    files = glob.glob(f"{folder}/*.jpg") + glob.glob(f"{folder}/*.png")
    
    print(f"Found {len(files)} total images")
    
    for file in files[:100]:  # Use first 100 images (fast training)
        try:
            img = Image.open(file).convert('RGB')
            img = img.resize((IMG_SIZE * 2, IMG_SIZE))  # Combined input+target
            img = np.array(img) / 127.5 - 1.0  # Normalize to [-1, 1]
            
            # Split into input and target
            input_img = img[:, :IMG_SIZE, :]
            target_img = img[:, IMG_SIZE:, :]
            
            images.append((input_img, target_img))
        except Exception as e:
            print(f"Error loading {file}: {e}")
            continue
    
    return images

# --- TRAINING LOOP ---
def train():
    print("🔨 Building models...")
    generator = build_generator()
    discriminator = build_discriminator()
    
    gen_optimizer = keras.optimizers.Adam(2e-4, beta_1=0.5)
    disc_optimizer = keras.optimizers.Adam(2e-4, beta_1=0.5)
    
    bce_loss = keras.losses.BinaryCrossentropy(from_logits=True)
    mae_loss = keras.losses.MeanAbsoluteError()
    
    print("📂 Loading dataset...")
    dataset = load_images(DATASET_PATH)
    print(f"✅ Loaded {len(dataset)} image pairs")
    
    if len(dataset) == 0:
        print("❌ No images found! Check your dataset path.")
        return
    
    print("🚀 Starting training...")
    for epoch in range(EPOCHS):
        print(f"\n📊 Epoch {epoch + 1}/{EPOCHS}")
        
        for i, (input_img, target_img) in enumerate(dataset):
            # Convert to TensorFlow tensors
            input_batch = tf.convert_to_tensor(np.expand_dims(input_img, 0), dtype=tf.float32)
            target_batch = tf.convert_to_tensor(np.expand_dims(target_img, 0), dtype=tf.float32)
            
            # Train Discriminator
            with tf.GradientTape() as tape:
                fake_img = generator(input_batch, training=True)
                
                real_pred = discriminator([input_batch, target_batch], training=True)
                fake_pred = discriminator([input_batch, fake_img], training=True)
                
                real_loss = bce_loss(tf.ones_like(real_pred), real_pred)
                fake_loss = bce_loss(tf.zeros_like(fake_pred), fake_pred)
                disc_loss = (real_loss + fake_loss) / 2
            
            disc_grads = tape.gradient(disc_loss, discriminator.trainable_variables)
            disc_optimizer.apply_gradients(zip(disc_grads, discriminator.trainable_variables))
            
            # Train Generator
            with tf.GradientTape() as tape:
                fake_img = generator(input_batch, training=True)
                fake_pred = discriminator([input_batch, fake_img], training=True)
                
                gan_loss = bce_loss(tf.ones_like(fake_pred), fake_pred)
                l1_loss = mae_loss(target_batch, fake_img)
                gen_loss = gan_loss + (100 * l1_loss)  # L1 weight = 100
            
            gen_grads = tape.gradient(gen_loss, generator.trainable_variables)
            gen_optimizer.apply_gradients(zip(gen_grads, generator.trainable_variables))
            
            if i % 10 == 0:
                print(f"  Step {i}/{len(dataset)} | D_loss: {disc_loss.numpy():.4f} | G_loss: {gen_loss.numpy():.4f}")
        
        # Save every 5 epochs
        if (epoch + 1) % 5 == 0:
            os.makedirs("models", exist_ok=True)
            generator.save(f"models/pix2pix_gen_epoch_{epoch+1}.h5")
            print(f"💾 Saved checkpoint at epoch {epoch+1}")
    
    # Final save
    os.makedirs("models", exist_ok=True)
    generator.save(OUTPUT_PATH)
    print(f"\n✅ Training complete! Model saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    train()