"""
Automated API Testing Script
Tests all endpoints of the Eco-Urbanist AI API
"""

import requests
import json
from pathlib import Path
from datetime import datetime


class APITester:
    """Automated API testing class"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.test_results = []
        
    def log_test(self, test_name, status, message="", details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        self.test_results.append(result)
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} {test_name}: {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        print("\n" + "=" * 60)
        print("Test 1: Root Endpoint")
        print("=" * 60)
        
        try:
            response = requests.get(f"{self.base_url}/")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "operational":
                    self.log_test(
                        "Root Endpoint",
                        "PASS",
                        "API is operational",
                        f"Version: {data.get('version')}"
                    )
                else:
                    self.log_test("Root Endpoint", "FAIL", "Status not operational")
            else:
                self.log_test("Root Endpoint", "FAIL", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Root Endpoint", "FAIL", str(e))
    
    def test_health_check(self):
        """Test health check endpoint"""
        print("\n" + "=" * 60)
        print("Test 2: Health Check")
        print("=" * 60)
        
        try:
            response = requests.get(f"{self.base_url}/health")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    tf_info = data.get("tensorflow", {})
                    cv_info = data.get("opencv", {})
                    
                    self.log_test(
                        "Health Check",
                        "PASS",
                        "All systems healthy",
                        f"TensorFlow: {tf_info.get('version')}, OpenCV: {cv_info.get('version')}"
                    )
                else:
                    self.log_test("Health Check", "FAIL", "Not healthy")
            else:
                self.log_test("Health Check", "FAIL", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Health Check", "FAIL", str(e))
    
    def test_service_info(self):
        """Test service info endpoint"""
        print("\n" + "=" * 60)
        print("Test 3: Service Info")
        print("=" * 60)
        
        try:
            response = requests.get(f"{self.base_url}/api/service-info")
            
            if response.status_code == 200:
                data = response.json()
                model_info = data.get("model", {})
                
                self.log_test(
                    "Service Info",
                    "PASS",
                    f"Model: {model_info.get('type')}",
                    f"Generator params: {model_info.get('generator_params'):,}"
                )
            else:
                self.log_test("Service Info", "FAIL", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Service Info", "FAIL", str(e))
    
    def test_green_score(self):
        """Test green score calculation"""
        print("\n" + "=" * 60)
        print("Test 4: Green Score Calculation")
        print("=" * 60)
        
        test_images = [
            ("satellite_high_green.png", 60, 100),
            ("satellite_medium_green.png", 20, 80),
            ("satellite_low_green.png", 0, 20)
        ]
        
        for img_name, min_score, max_score in test_images:
            img_path = Path(f"data/test/{img_name}")
            
            if not img_path.exists():
                self.log_test(
                    f"Green Score - {img_name}",
                    "SKIP",
                    "Test image not found"
                )
                continue
            
            try:
                with open(img_path, 'rb') as f:
                    files = {'file': (img_name, f, 'image/png')}
                    response = requests.post(
                        f"{self.base_url}/api/green-score",
                        files=files
                    )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        score = data.get("green_score", {}).get("green_score", 0)
                        
                        if min_score <= score <= max_score:
                            self.log_test(
                                f"Green Score - {img_name}",
                                "PASS",
                                f"Score: {score}% (expected {min_score}-{max_score}%)"
                            )
                        else:
                            self.log_test(
                                f"Green Score - {img_name}",
                                "WARN",
                                f"Score: {score}% (out of expected range {min_score}-{max_score}%)"
                            )
                    else:
                        self.log_test(f"Green Score - {img_name}", "FAIL", "Success = False")
                else:
                    self.log_test(
                        f"Green Score - {img_name}",
                        "FAIL",
                        f"Status code: {response.status_code}"
                    )
                    
            except Exception as e:
                self.log_test(f"Green Score - {img_name}", "FAIL", str(e))
    
    def test_prediction(self):
        """Test image prediction"""
        print("\n" + "=" * 60)
        print("Test 5: Image Prediction")
        print("=" * 60)
        
        img_path = Path("data/test/building_mask_1.png")
        
        if not img_path.exists():
            self.log_test("Image Prediction", "SKIP", "Test image not found")
            return
        
        try:
            with open(img_path, 'rb') as f:
                files = {'file': ('building_mask_1.png', f, 'image/png')}
                response = requests.post(
                    f"{self.base_url}/api/predict",
                    files=files
                )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    output_filename = data.get("output_filename")
                    green_scores = data.get("green_scores", {})
                    
                    self.log_test(
                        "Image Prediction",
                        "PASS",
                        f"Generated: {output_filename}",
                        f"Output green score: {green_scores.get('output', {}).get('green_score', 0)}%"
                    )
                    
                    return output_filename
                else:
                    self.log_test("Image Prediction", "FAIL", "Success = False")
            else:
                self.log_test("Image Prediction", "FAIL", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Image Prediction", "FAIL", str(e))
        
        return None
    
    def test_list_outputs(self):
        """Test list outputs endpoint"""
        print("\n" + "=" * 60)
        print("Test 6: List Outputs")
        print("=" * 60)
        
        try:
            response = requests.get(f"{self.base_url}/api/list-outputs")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    count = data.get("count", 0)
                    self.log_test(
                        "List Outputs",
                        "PASS",
                        f"Found {count} images"
                    )
                else:
                    self.log_test("List Outputs", "FAIL", "Success = False")
            else:
                self.log_test("List Outputs", "FAIL", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("List Outputs", "FAIL", str(e))
    
    def test_download(self, filename):
        """Test file download"""
        print("\n" + "=" * 60)
        print("Test 7: File Download")
        print("=" * 60)
        
        if not filename:
            self.log_test("File Download", "SKIP", "No filename provided")
            return
        
        try:
            response = requests.get(f"{self.base_url}/api/download/{filename}")
            
            if response.status_code == 200:
                size_kb = len(response.content) / 1024
                self.log_test(
                    "File Download",
                    "PASS",
                    f"Downloaded {filename}",
                    f"Size: {size_kb:.2f} KB"
                )
            else:
                self.log_test("File Download", "FAIL", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("File Download", "FAIL", str(e))
    
    def run_all_tests(self):
        """Run all tests"""
        print("\n" + "=" * 80)
        print("🧪 ECO-URBANIST AI - AUTOMATED API TESTING")
        print("=" * 80)
        print(f"Base URL: {self.base_url}")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run tests
        self.test_root_endpoint()
        self.test_health_check()
        self.test_service_info()
        self.test_green_score()
        output_filename = self.test_prediction()
        self.test_list_outputs()
        self.test_download(output_filename)
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total = len(self.test_results)
        passed = sum(1 for r in self.test_results if r["status"] == "PASS")
        failed = sum(1 for r in self.test_results if r["status"] == "FAIL")
        warned = sum(1 for r in self.test_results if r["status"] == "WARN")
        skipped = sum(1 for r in self.test_results if r["status"] == "SKIP")
        
        print(f"Total Tests: {total}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"⚠️  Warnings: {warned}")
        print(f"⏭️  Skipped: {skipped}")
        
        success_rate = (passed / total * 100) if total > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        if failed == 0:
            print("\n🎉 All tests passed! API is working perfectly!")
        else:
            print("\n⚠️  Some tests failed. Check the logs above.")
        
        print("=" * 80)


if __name__ == "__main__":
    # Create tester
    tester = APITester(base_url="http://localhost:8000")
    
    # Run all tests
    tester.run_all_tests()