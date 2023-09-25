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

for((i = 0; i < 500000; i++)); do
curl -s -L -X POST "localhost:5000/api/medicines/add" \
-H "access-device: 123123" \
-H "user-token: abc241738365f80c9a3fcb50" \
-H "Content-Type: application/json" \
--data-raw "{
    \"name\":\"sasdad2312dsasdas3ssd2asdasdasd1asdasdasdasdadasds${i}\",
    \"typeMedicineIds\":\"he12aded\",
    \"entryPrice\": 10000,
    \"unit\": 2000
}" \
--compressed & 
  done