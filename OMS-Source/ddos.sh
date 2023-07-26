# for((i = 0; i < 1000; i++)); do
#  curl -s -L -X POST "localhost:5000/api/users/register" \
# -H "access-device: super new " \
# -H "user-token: zip" \
# -H "Content-Type: application/json" \
# --data-raw "{
#    \"username\" : \"tddssd${i}\",
#    \"password\" : \"123123\",
#    \"fullName\" : \"Trần Hiệp\",
#    \"age\" : 9,
#    \"address\" : \"Gia Kiệm\",
#    \"phoneNumber\" : \"0987564211\",
#    \"email\" : \"trani${i}\"
# }" \
# --compressed & 
#   done

for((i = 0; i < 2000; i++)); do
curl -s -L -X POST "localhost:5000/api/medicines/add" \
-H "access-device: 123123" \
-H "user-token: b4af5e6e3a9e21e81f22cc33" \
-H "Content-Type: application/json" \
--data-raw "{
    \"name\":\"ssss${i}\",
    \"typeMedicineIds\":\"headed\",
    \"entryPrice\": 5,
    \"unit\": 1000
}" \
--compressed & 
  done