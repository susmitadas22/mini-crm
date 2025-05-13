for i in $(seq 1 20); do
  curl -s -X POST http://localhost:3000/api/ingest/customer \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"User$i\",
      \"email\": \"user$i@example.com\",
      \"phone\": \"+919999000$i\"
    }"
done


for i in $(seq 1 100); do
  email="user$((1 + RANDOM % 20))@example.com"
  amount=$((RANDOM % 10000 + 100)) # ₹100–₹10,099

  curl -s -X POST http://localhost:3000/api/ingest/order \
    -H "Content-Type: application/json" \
    -d "{
      \"customerEmail\": \"$email\",
      \"amount\": $amount
    }"
done
