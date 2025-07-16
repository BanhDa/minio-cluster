## Cài đặt

### Yêu cầu hệ thống

1. **Node.js**
2. **Docker**
3. **MinIO Cluster**

- Minio cluster với 3 node và Nginx để loadbalancer
- Dữ liệu của mỗi node được mount đến 2 folder:

  - node1/data/data1
  - node1/data/data2

  - node1/data/data1
  - node1/data/data2

  - node1/data/data1
  - node1/data/data2

### Cài đặt các phụ thuộc

1. Cài đặt các dependencies (nếu có):

   ```bash
   npm install axios
   npm install minio
   ```

## Sử dụng

### Cách chạy ứng dụng

- Deploy Minio Cluster

  ```bash
  docker compose up -d
  ```

- Truy cập ứng dụng qua trình duyệt: [http://localhost:9000](http://localhost:9000)
  - Đăng nhập
  - Tạo bucket: mybucket

### Cách sử dụng API Upload và download file với cơ chế Presiged

## Chạy kiểm thử

- Upload file client/example.txt lên minio

  ```bash
  node client/upload.js
  ```

- Dowload file example.txt từ minio xuống file đích client/downloaded_example.txt
  ```bash
  node client/download.js
  ```


docker run -d --name minio \
  -p 9000:9000 -p 9001:9001 \
  -v /mnt/disk1:/data1 \
  -v /mnt/disk2:/data2 \
  minio/minio server \
  http://10.0.2.11/data1 http://10.0.2.11/data2 \
  http://10.0.2.12/data1 http://10.0.2.12/data2 \
  http://10.0.2.13/data1 http://10.0.2.13/data2 \
  --console-address ":9001"