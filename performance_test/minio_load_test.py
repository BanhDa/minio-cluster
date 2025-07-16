from locust import TaskSet, task, between, HttpUser
from minio import Minio
from io import BytesIO
import random
import string

def random_file_name(ext):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=10)) + f".{ext}"

def generate_fake_file(size_kb=100):
    return BytesIO(b'a' * size_kb * 1024)

class MinIOTasks(TaskSet):
    def on_start(self):
        self.client = Minio(
            endpoint="your-minio-url:9000",
            access_key="YOUR-ACCESS-KEY",
            secret_key="YOUR-SECRET-KEY",
            secure=False
        )
        self.bucket_name = "test-bucket"
        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    @task(2)
    def upload_file(self):
        file_size = random.randint(100, 1024 * 2)  # 100KB - 2MB
        data = generate_fake_file(file_size)
        file_name = random_file_name(random.choice(["docx", "xlsx"]))
        self.client.put_object(
            self.bucket_name,
            file_name,
            data,
            length=data.getbuffer().nbytes,
            content_type="application/octet-stream"
        )

    @task(1)
    def download_file(self):
        objects = list(self.client.list_objects(self.bucket_name, recursive=True))
        if not objects:
            return
        obj = random.choice(objects)
        try:
            response = self.client.get_object(self.bucket_name, obj.object_name)
            response.read()  # đọc hết để mô phỏng download hoàn chỉnh
            response.close()
        except Exception as e:
            print("Download failed:", e)

class MinIOUser(HttpUser):
    tasks = [MinIOTasks]
    wait_time = between(1, 3)
