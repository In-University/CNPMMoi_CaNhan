# h## Tìm kiếm mờ (Fuzzy Search) với Elasticsearch

Backend (ExpressJS01) đã tích hợp Elasticsearch để tìm kiếm sản phẩm theo tên/mô tả với fuzziness.

- API: GET `/v1/api/products/search?q=keyword&page=1&limit=12&categoryId=<optional>`
- Biến môi trường:
  - `ELASTICSEARCH_NODE` hoặc `ES_NODE` (mặc định: `http://localhost:9200`)
  - `ELASTICSEARCH_API_KEY` hoặc `ES_API_KEY` (ưu tiên dùng)
  - `ELASTICSEARCH_USERNAME`, `ELASTICSEARCH_PASSWORD` (fallback nếu không có API key)
  - `ELASTICSEARCH_INDEX` hoặc `ES_INDEX` (mặc định: `products`)

Khi server khởi động, dữ liệu sản phẩm sẽ được index nền vào Elasticsearch. Frontend `reactjs01` đã có ô tìm kiếm trên trang Products, gọi API trên và hiển thị kết quả.

### Các lệnh tiện ích
```bash
# Kiểm tra kết nối Elasticsearch
pnpm run es:ping

# Cập nhật mapping cho index
pnpm run es:put-mapping

# Index toàn bộ sản phẩm từ MongoDB
pnpm run es:index-all
```

### Ví dụ test API
```bash
# Tìm kiếm "laptop" (fuzzy)
curl "http://localhost:6969/v1/api/products/search?q=laptop&page=1&limit=5"

# Tìm kiếm với category filter
curl "http://localhost:6969/v1/api/products/search?q=phone&categoryId=68b7a45f73b4c0f52480a22a&page=1&limit=10"
```

Yêu cầu chạy:
- Cài và chạy Elasticsearch local trên port 9200 HOẶC sử dụng Elastic Cloud
- Cài dependencies và chạy backend trong `Week2_2/ExpressJS01`
- Cài dependencies và chạy frontend trong `Week2_2/reactjs01`cmute.edu.vn/mod/assign/view.php?id=869255
# Bài tập 04 (27/08/2025): Fullstack với ExpressJS, ReactJS

## Tìm kiếm mờ (Fuzzy Search) với Elasticsearch

Backend (ExpressJS01) đã tích hợp Elasticsearch để tìm kiếm sản phẩm theo tên/mô tả với fuzziness.

- API: GET `/v1/api/products/search?q=keyword&page=1&limit=12&categoryId=<optional>`
- Biến môi trường:
	- `ELASTICSEARCH_NODE` (mặc định: `http://localhost:9200`)
	- `ELASTICSEARCH_USERNAME`, `ELASTICSEARCH_PASSWORD` nếu cluster có bảo mật
	- `ELASTICSEARCH_INDEX` (mặc định: `products`)

Khi server khởi động, dữ liệu sản phẩm sẽ được index nền vào Elasticsearch. Frontend `reactjs01` đã có ô tìm kiếm trên trang Products, gọi API trên và hiển thị kết quả.

Yêu cầu chạy:
- Cài và chạy Elasticsearch local trên port 9200
- Cài dependencies và chạy backend trong `Week2_2/ExpressJS01`
- Cài dependencies và chạy frontend trong `Week2_2/reactjs01`