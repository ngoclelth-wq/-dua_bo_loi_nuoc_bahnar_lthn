import { GradeQuestionData, Language } from './types';

export const QUESTIONS_BY_LANGUAGE_AND_GRADE: Record<Language, GradeQuestionData> = {
  vi: {
    "Lớp 1": {
      "Các số từ 0 đến 10": [
        { q: "Số liền sau của 5?", a: "6" }, { q: "Số liền trước của 1?", a: "0" }, { q: "Số lớn nhất trong các số 2, 8, 5?", a: "8" }, { q: "4 thêm 1 = ?", a: "5" }, { q: "Số bé nhất trong các số 3, 1, 7?", a: "1" },
        { q: "Số đứng giữa 7 và 9?", a: "8" }, { q: "Đếm từ 0 đến 3 có bao nhiêu số?", a: "4" }, { q: "Số lớn hơn 6 nhưng nhỏ hơn 8?", a: "7" }
      ],
      "Phép cộng, phép trừ trong phạm vi 10": [
        { q: "2 + 3 = ?", a: "5" }, { q: "7 - 4 = ?", a: "3" }, { q: "5 + 5 = ?", a: "10" }, { q: "9 - 0 = ?", a: "9" }, { q: "1 + 8 = ?", a: "9" },
        { q: "10 - 6 = ?", a: "4" }, { q: "4 + 4 = ?", a: "8" }, { q: "8 - 3 = ?", a: "5" }, { q: "6 + 2 = ?", a: "8" }, { q: "7 - 5 = ?", a: "2" }
      ],
      "Các số đến 100, Phép cộng, phép trừ trong phạm vi 100": [
        { q: "Số liền sau của 19?", a: "20" }, { q: "Số liền trước của 50?", a: "49" }, { q: "Số lớn nhất có hai chữ số?", a: "99" }, { q: "Số bé nhất có hai chữ số?", a: "10" },
        { q: "Số tròn chục lớn nhất nhỏ hơn 100?", a: "90" }, { q: "Số 7 chục và 0 đơn vị là số nào?", a: "70" }, { q: "99 + 1 = ?", a: "100" },
        { q: "30 + 20 = ?", a: "50" }, { q: "80 - 40 = ?", a: "40" }, { q: "42 + 5 = ?", a: "47" }, { q: "67 - 7 = ?", a: "60" }, { q: "21 + 34 = ?", a: "55" },
        { q: "99 - 11 = ?", a: "88" }, { q: "50 + 7 = ?", a: "57" }, { q: "45 - 20 = ?", a: "25" }
      ],
      "Thời gian, giờ và lịch": [
        { q: "Một tuần lễ có mấy ngày?", a: "7" }, { q: "Kim dài chỉ số 12, kim ngắn chỉ số 3 là mấy giờ?", a: "3" }, { q: "Hôm nay là thứ Hai, ngày mai là thứ mấy?", a: "Thứ Ba" }, { q: "Một ngày có bao nhiêu giờ?", a: "24" }, { q: "Đồng hồ chỉ 10 giờ thì kim ngắn chỉ số mấy?", a: "10" }
      ]
    },
    "Lớp 2": {
      "Cộng, trừ phạm vi 20": [
        { q: "9 + 5 = ?", a: "14" }, { q: "8 + 7 = ?", a: "15" }, { q: "12 - 4 = ?", a: "8" }, { q: "15 - 9 = ?", a: "6" }, { q: "6 + 8 = ?", a: "14" },
        { q: "11 - 3 = ?", a: "8" }, { q: "7 + 4 = ?", a: "11" }, { q: "13 - 6 = ?", a: "7" }, { q: "9 + 9 = ?", a: "18" }, { q: "14 - 5 = ?", a: "9" }
      ],
      "Phép cộng, phép trừ (có nhớ) trong phạm vi 100": [
        { q: "38 + 25 = ?", a: "63" }, { q: "72 - 48 = ?", a: "24" }, { q: "45 + 37 = ?", a: "82" }, { q: "90 - 56 = ?", a: "34" }, { q: "19 + 64 = ?", a: "83" },
        { q: "81 - 27 = ?", a: "54" }, { q: "55 + 18 = ?", a: "73" }, { q: "60 - 32 = ?", a: "28" }, { q: "47 + 29 = ?", a: "76" }, { q: "83 - 35 = ?", a: "48" }
      ],
      "Phép nhân, phép chia 2 và 5": [
        { q: "2 x 6 = ?", a: "12" }, { q: "5 x 4 = ?", a: "20" }, { q: "10 : 2 = ?", a: "5" }, { q: "25 : 5 = ?", a: "5" }, { q: "2 x 9 = ?", a: "18" },
        { q: "5 x 8 = ?", a: "40" }, { q: "14 : 2 = ?", a: "7" }, { q: "45 : 5 = ?", a: "9" }, { q: "2 x 7 = ?", a: "14" }, { q: "35 : 5 = ?", a: "7" }
      ],
      "Các số trong phạm vi 1000": [
        { q: "Số lớn nhất có ba chữ số?", a: "999" }, { q: "Số liền sau của 999?", a: "1000" }, { q: "Số bé nhất có ba chữ số?", a: "100" }, { q: "Số gồm 5 trăm và 2 đơn vị?", a: "502" }
      ],
      "Phép cộng, phép trừ trong phạm vi 1000": [
        { q: "200 + 300 = ?", a: "500" }, { q: "700 - 400 = ?", a: "300" }, { q: "120 + 50 = ?", a: "170" }, { q: "450 - 30 = ?", a: "420" }, { q: "500 + 500 = ?", a: "1000" },
        { q: "350 + 150 = ?", a: "500" }, { q: "900 - 250 = ?", a: "650" }, { q: "600 + 400 = ?", a: "1000" }, { q: "850 - 50 = ?", a: "800" }, { q: "100 + 900 = ?", a: "1000" }
      ],
      "Làm quen với thống kê, xác suất": [
        { q: "Trong túi có 2 bi đỏ, 1 bi xanh. Lấy 1 bi, khả năng cao là bi màu gì?", a: "Đỏ" }, { q: "Gieo xúc xắc, mặt có 7 chấm có thể xuất hiện không (Có / Không)?", a: "Không" }, { q: "Có 3 quả cam và 2 quả táo, tổng số quả?", a: "5" },
        { q: "Khả năng lấy được bi vàng trong túi chỉ có bi đỏ (Có thể / Không thể)?", a: "Không thể" }, { q: "Có 4 con thỏ và 3 con gà, tổng số chân thỏ?", a: "16" }
      ]
    },
    "Lớp 3": {
      "Bảng nhân, bảng chia": [
        { q: "6 x 8 = ?", a: "48" }, { q: "7 x 9 = ?", a: "63" }, { q: "42 : 6 = ?", a: "7" }, { q: "56 : 7 = ?", a: "8" }, { q: "8 x 4 = ?", a: "32" },
        { q: "9 x 5 = ?", a: "45" }, { q: "64 : 8 = ?", a: "8" }, { q: "81 : 9 = ?", a: "9" }, { q: "7 x 6 = ?", a: "42" }, { q: "49 : 7 = ?", a: "7" }
      ],
      "Phép nhân, phép chia trong phạm vi 100": [
        { q: "12 x 4 = ?", a: "48" }, { q: "15 x 3 = ?", a: "45" }, { q: "60 : 5 = ?", a: "12" }, { q: "84 : 4 = ?", a: "21" }, { q: "11 x 9 = ?", a: "99" },
        { q: "24 x 2 = ?", a: "48" }, { q: "13 x 5 = ?", a: "65" }, { q: "75 : 3 = ?", a: "25" }, { q: "96 : 6 = ?", a: "16" }, { q: "14 x 7 = ?", a: "98" }
      ],
      "Phép chia trong phạm vi 1000": [
        { q: "400 : 2 = ?", a: "200" }, { q: "900 : 3 = ?", a: "300" }, { q: "150 : 5 = ?", a: "30" }, { q: "240 : 6 = ?", a: "40" }, { q: "1000 : 8 = ?", a: "125" },
        { q: "500 : 4 = ?", a: "125" }, { q: "720 : 9 = ?", a: "80" }, { q: "640 : 8 = ?", a: "80" }, { q: "360 : 4 = ?", a: "90" }, { q: "810 : 9 = ?", a: "90" }
      ],
      "Các số đến 10000": [
        { q: "Số lớn nhất có bốn chữ số?", a: "9999" }, { q: "Số liền sau của 9999?", a: "10000" }, { q: "5000 + 5000 = ?", a: "10000" }, { q: "Số bé nhất có bốn chữ số?", a: "1000" }, { q: "Số 7856 gồm mấy nghìn?", a: "7" }
      ],
      "Chu vi, diện tích một số hình phẳng": [
        { q: "Chu vi hình vuông cạnh 5 cm?", a: "20" }, { q: "Diện tích hình chữ nhật cạnh 4 cm và 6 cm?", a: "24" }, { q: "Chu vi hình chữ nhật dài 7 cm, rộng 3 cm?", a: "20" }, { q: "Diện tích hình vuông cạnh 4 cm?", a: "16" }, { q: "Một hình chữ nhật có chiều dài 10cm, chiều rộng 5cm. Diện tích?", a: "50" }
      ],
      "Cộng, trừ, nhân, chia trong phạm vi 10000": [
        { q: "2000 + 3000 = ?", a: "5000" }, { q: "8000 - 5000 = ?", a: "3000" }, { q: "1200 x 4 = ?", a: "4800" }, { q: "9000 : 3 = ?", a: "3000" }, { q: "4500 + 2500 = ?", a: "7000" },
        { q: "6000 - 1500 = ?", a: "4500" }, { q: "2500 x 3 = ?", a: "7500" }, { q: "8400 : 4 = ?", a: "2100" }, { q: "3300 + 6700 = ?", a: "10000" }, { q: "10000 - 4500 = ?", a: "5500" }
      ],
      "Cộng, trừ trong phạm vi 100000": [
        { q: "20000 + 30000 = ?", a: "50000" }, { q: "100000 - 50000 = ?", a: "50000" }, { q: "45000 + 5000 = ?", a: "50000" }, { q: "75000 - 25000 = ?", a: "50000" }, { q: "12345 + 54321 = ?", a: "66666" },
        { q: "60000 + 40000 = ?", a: "100000" }, { q: "90000 - 45000 = ?", a: "45000" }, { q: "32000 + 18000 = ?", a: "50000" }, { q: "88000 - 22000 = ?", a: "66000" }, { q: "15000 + 85000 = ?", a: "100000" }
      ]
    },
    "Lớp 4": {
      "Số có nhiều chữ số": [
        { q: "Số gồm 5 triệu, 2 trăm nghìn và 3 đơn vị viết là?", a: "5200003" }, { q: "Giá trị chữ số 7 trong số 745000?", a: "700000" }, { q: "Số lớn nhất có sáu chữ số?", a: "999999" },
        { q: "Số 1000000 có mấy chữ số 0?", a: "6" }
      ],
      "Phép cộng và phép trừ": [
        { q: "450000 + 550000 = ?", a: "1000000" }, { q: "1000000 - 1 = ?", a: "999999" }, { q: "123456 + 1 = ?", a: "123457" },
        { q: "250000 + 750000 = ?", a: "1000000" }, { q: "500000 - 250000 = ?", a: "250000" }, { q: "123000 + 456000 = ?", a: "579000" }, { q: "987000 - 123000 = ?", a: "864000" }
      ],
      "Phép nhân và phép chia": [
        { q: "125 x 8 = ?", a: "1000" }, { q: "25 x 40 = ?", a: "1000" }, { q: "8000 : 25 = ?", a: "320" }, { q: "150 x 20 = ?", a: "3000" }, { q: "4500 : 50 = ?", a: "90" },
        { q: "12 x 125 = ?", a: "1500" }, { q: "1000 : 8 = ?", a: "125" }, { q: "250 x 4 = ?", a: "1000" }, { q: "5000 : 20 = ?", a: "250" }, { q: "11 x 11 = ?", a: "121" }
      ],
      "Phân số và phép tính": [
        { q: "1/2 + 1/4 = ?", a: "3/4" }, { q: "1 - 1/3 = ?", a: "2/3" }, { q: "3/5 + 2/5 = ?", a: "1" },
        { q: "1/4 + 3/4 = ?", a: "1" }, { q: "2/7 + 3/7 = ?", a: "5/7" }, { q: "1/2 x 1/3 = ?", a: "1/6" }, { q: "3/4 x 4 = ?", a: "3" },
        { q: "1/4 x 1/2 = ?", a: "1/8" }
      ],
      "Chu vi và diện tích": [
        { q: "Chu vi hình chữ nhật dài 8cm, rộng 5cm?", a: "26" }, { q: "Diện tích hình vuông cạnh 7cm?", a: "49" },
        { q: "Chu vi hình vuông cạnh 10cm?", a: "40" }, { q: "Diện tích hình chữ nhật dài 12cm, rộng 4cm?", a: "48" }, { q: "Một hình chữ nhật có chu vi 20cm, chiều dài 6cm. Chiều rộng?", a: "4" }
      ]
    },
    "Lớp 5": {
      "Số thập phân và phép tính": [
        { q: "0,5 + 0,25 = ?", a: "0,75" }, { q: "1,2 - 0,4 = ?", a: "0,8" }, { q: "2,5 x 4 = ?", a: "10" }, { q: "10 : 2,5 = ?", a: "4" },
        { q: "0,1 + 0,9 = ?", a: "1" }, { q: "5,5 - 1,5 = ?", a: "4" }, { q: "1,5 x 2 = ?", a: "3" }, { q: "12 : 0,5 = ?", a: "24" },
        { q: "3,4 + 6,6 = ?", a: "10" }, { q: "9,8 - 4,3 = ?", a: "5,5" }
      ],
      "Chu vi, diện tích và thể tích": [
        { q: "Diện tích tam giác có đáy 10, chiều cao 5?", a: "25" }, { q: "Chu vi hình tròn có đường kính 10 (pi = 3,14)?", a: "31,4" }, { q: "Diện tích hình thang có đáy 4, 6 và chiều cao 5?", a: "25" },
        { q: "Thể tích hình lập phương cạnh 2 xăng-ti-mét?", a: "8" }, { q: "Thể tích hình hộp chữ nhật có cạnh 2, 3, 4?", a: "24" }, { q: "Diện tích toàn phần hình lập phương cạnh 1?", a: "6" }
      ],
      "Vận tốc, quãng đường, thời gian": [
        { q: "2 giờ 30 phút = ? phút", a: "150" }, { q: "Vận tốc 60 km/h, thời gian 2 giờ. Quãng đường?", a: "120" },
        { q: "Quãng đường 100 km, vận tốc 50 km/h. Thời gian?", a: "2" }, { q: "Vận tốc 15 m/s, thời gian 10 giây. Quãng đường?", a: "150" }
      ],
      "Tỉ số phần trăm": [
        { q: "Tỉ số phần trăm của 2 và 5?", a: "40%" }, { q: "Tỉ số phần trăm của 1 và 4?", a: "25%" }, { q: "20% của 100 = ?", a: "20" }, { q: "Trong một hộp có 3 bi xanh, 7 bi đỏ. Tỉ số phần trăm bi xanh?", a: "30%" }
      ]
    }
  },
  en: {
    "Grade 1": {
      "Numbers from 0 to 10": [
        { q: "Number right after 5?", a: "6" }, { q: "Number right before 1?", a: "0" }, { q: "Largest number among 2, 8, 5?", a: "8" }, { q: "4 plus 1 = ?", a: "5" }, { q: "Smallest number among 3, 1, 7?", a: "1" },
        { q: "Number between 7 and 9?", a: "8" }, { q: "How many numbers from 0 to 3?", a: "4" }, { q: "Number greater than 6 but less than 8?", a: "7" }
      ],
      "Addition & Subtraction within 10": [
        { q: "2 + 3 = ?", a: "5" }, { q: "7 - 4 = ?", a: "3" }, { q: "5 + 5 = ?", a: "10" }, { q: "9 - 0 = ?", a: "9" }, { q: "1 + 8 = ?", a: "9" },
        { q: "10 - 6 = ?", a: "4" }, { q: "4 + 4 = ?", a: "8" }, { q: "8 - 3 = ?", a: "5" }, { q: "6 + 2 = ?", a: "8" }, { q: "7 - 5 = ?", a: "2" }
      ],
      "Numbers to 100 & Add/Subtract": [
        { q: "Number right after 19?", a: "20" }, { q: "Number right before 50?", a: "49" }, { q: "Largest two-digit number?", a: "99" }, { q: "Smallest two-digit number?", a: "10" },
        { q: "Largest round ten less than 100?", a: "90" }, { q: "7 tens and 0 ones is what number?", a: "70" }, { q: "99 + 1 = ?", a: "100" },
        { q: "30 + 20 = ?", a: "50" }, { q: "80 - 40 = ?", a: "40" }, { q: "42 + 5 = ?", a: "47" }, { q: "67 - 7 = ?", a: "60" }, { q: "21 + 34 = ?", a: "55" },
        { q: "99 - 11 = ?", a: "88" }, { q: "50 + 7 = ?", a: "57" }, { q: "45 - 20 = ?", a: "25" }
      ],
      "Time, Clock & Calendar": [
        { q: "How many days in a week?", a: "7" }, { q: "Minute hand at 12, hour hand at 3 is what time?", a: "3" }, { q: "Today is Monday, what day is tomorrow?", a: "Tuesday" }, { q: "How many hours in a full day?", a: "24" }, { q: "If clock shows 10 o'clock, what number does hour hand point to?", a: "10" }
      ]
    },
    "Grade 2": {
      "Add & Subtract within 20": [
        { q: "9 + 5 = ?", a: "14" }, { q: "8 + 7 = ?", a: "15" }, { q: "12 - 4 = ?", a: "8" }, { q: "15 - 9 = ?", a: "6" }, { q: "6 + 8 = ?", a: "14" },
        { q: "11 - 3 = ?", a: "8" }, { q: "7 + 4 = ?", a: "11" }, { q: "13 - 6 = ?", a: "7" }, { q: "9 + 9 = ?", a: "18" }, { q: "14 - 5 = ?", a: "9" }
      ],
      "Add & Subtract with regrouping within 100": [
        { q: "38 + 25 = ?", a: "63" }, { q: "72 - 48 = ?", a: "24" }, { q: "45 + 37 = ?", a: "82" }, { q: "90 - 56 = ?", a: "34" }, { q: "19 + 64 = ?", a: "83" },
        { q: "81 - 27 = ?", a: "54" }, { q: "55 + 18 = ?", a: "73" }, { q: "60 - 32 = ?", a: "28" }, { q: "47 + 29 = ?", a: "76" }, { q: "83 - 35 = ?", a: "48" }
      ],
      "Multiplication & Division of 2 and 5": [
        { q: "2 x 6 = ?", a: "12" }, { q: "5 x 4 = ?", a: "20" }, { q: "10 : 2 = ?", a: "5" }, { q: "25 : 5 = ?", a: "5" }, { q: "2 x 9 = ?", a: "18" },
        { q: "5 x 8 = ?", a: "40" }, { q: "14 : 2 = ?", a: "7" }, { q: "45 : 5 = ?", a: "9" }, { q: "2 x 7 = ?", a: "14" }, { q: "35 : 5 = ?", a: "7" }
      ],
      "Numbers up to 1000": [
        { q: "Largest three-digit number?", a: "999" }, { q: "Number right after 999?", a: "1000" }, { q: "Smallest three-digit number?", a: "100" }, { q: "Number consisting of 5 hundreds and 2 ones?", a: "502" }
      ],
      "Add & Subtract within 1000": [
        { q: "200 + 300 = ?", a: "500" }, { q: "700 - 400 = ?", a: "300" }, { q: "120 + 50 = ?", a: "170" }, { q: "450 - 30 = ?", a: "420" }, { q: "500 + 500 = ?", a: "1000" },
        { q: "350 + 150 = ?", a: "500" }, { q: "900 - 250 = ?", a: "650" }, { q: "600 + 400 = ?", a: "1000" }, { q: "850 - 50 = ?", a: "800" }, { q: "100 + 900 = ?", a: "1000" }
      ],
      "Statistics & Probability": [
        { q: "A bag has 2 red marbles and 1 blue marble. Pick 1, which color is more likely?", a: "Red" }, { q: "Roll a 6-sided die, can a 7 appear (Yes / No)?", a: "No" }, { q: "3 oranges and 2 apples, total fruits?", a: "5" },
        { q: "Chance of picking yellow marble from bag with only red marbles (Possible / Impossible)?", a: "Impossible" }, { q: "4 rabbits and 3 chickens, total rabbit legs?", a: "16" }
      ]
    },
    "Grade 3": {
      "Multiplication & Division Tables": [
        { q: "6 x 8 = ?", a: "48" }, { q: "7 x 9 = ?", a: "63" }, { q: "42 : 6 = ?", a: "7" }, { q: "56 : 7 = ?", a: "8" }, { q: "8 x 4 = ?", a: "32" },
        { q: "9 x 5 = ?", a: "45" }, { q: "64 : 8 = ?", a: "8" }, { q: "81 : 9 = ?", a: "9" }, { q: "7 x 6 = ?", a: "42" }, { q: "49 : 7 = ?", a: "7" }
      ],
      "Multiplication & Division within 100": [
        { q: "12 x 4 = ?", a: "48" }, { q: "15 x 3 = ?", a: "45" }, { q: "60 : 5 = ?", a: "12" }, { q: "84 : 4 = ?", a: "21" }, { q: "11 x 9 = ?", a: "99" },
        { q: "24 x 2 = ?", a: "48" }, { q: "13 x 5 = ?", a: "65" }, { q: "75 : 3 = ?", a: "25" }, { q: "96 : 6 = ?", a: "16" }, { q: "14 x 7 = ?", a: "98" }
      ],
      "Division within 1000": [
        { q: "400 : 2 = ?", a: "200" }, { q: "900 : 3 = ?", a: "300" }, { q: "150 : 5 = ?", a: "30" }, { q: "240 : 6 = ?", a: "40" }, { q: "1000 : 8 = ?", a: "125" },
        { q: "500 : 4 = ?", a: "125" }, { q: "720 : 9 = ?", a: "80" }, { q: "640 : 8 = ?", a: "80" }, { q: "360 : 4 = ?", a: "90" }, { q: "810 : 9 = ?", a: "90" }
      ],
      "Numbers up to 10000": [
        { q: "Largest four-digit number?", a: "9999" }, { q: "Number right after 9999?", a: "10000" }, { q: "5000 + 5000 = ?", a: "10000" }, { q: "Smallest four-digit number?", a: "1000" }, { q: "Number 7856 has how many thousands?", a: "7" }
      ],
      "Perimeter & Area of 2D Shapes": [
        { q: "Perimeter of square with side 5 cm?", a: "20" }, { q: "Area of rectangle with sides 4 cm and 6 cm?", a: "24" }, { q: "Perimeter of rectangle length 7 cm, width 3 cm?", a: "20" }, { q: "Area of square with side 4 cm?", a: "16" }, { q: "A rectangle has length 10cm and width 5cm. Area?", a: "50" }
      ],
      "Operations within 10000": [
        { q: "2000 + 3000 = ?", a: "5000" }, { q: "8000 - 5000 = ?", a: "3000" }, { q: "1200 x 4 = ?", a: "4800" }, { q: "9000 : 3 = ?", a: "3000" }, { q: "4500 + 2500 = ?", a: "7000" },
        { q: "6000 - 1500 = ?", a: "4500" }, { q: "2500 x 3 = ?", a: "7500" }, { q: "8400 : 4 = ?", a: "2100" }, { q: "3300 + 6700 = ?", a: "10000" }, { q: "10000 - 4500 = ?", a: "5500" }
      ],
      "Add & Subtract within 100000": [
        { q: "20000 + 30000 = ?", a: "50000" }, { q: "100000 - 50000 = ?", a: "50000" }, { q: "45000 + 5000 = ?", a: "50000" }, { q: "75000 - 25000 = ?", a: "50000" }, { q: "12345 + 54321 = ?", a: "66666" },
        { q: "60000 + 40000 = ?", a: "100000" }, { q: "90000 - 45000 = ?", a: "45000" }, { q: "32000 + 18000 = ?", a: "50000" }, { q: "88000 - 22000 = ?", a: "66000" }, { q: "15000 + 85000 = ?", a: "100000" }
      ]
    },
    "Grade 4": {
      "Large Numbers": [
        { q: "Number with 5 millions, 2 hundred thousands and 3 ones?", a: "5200003" }, { q: "Value of digit 7 in 745000?", a: "700000" }, { q: "Largest six-digit number?", a: "999999" },
        { q: "How many zeroes are in 1000000?", a: "6" }
      ],
      "Addition & Subtraction": [
        { q: "450000 + 550000 = ?", a: "1000000" }, { q: "1000000 - 1 = ?", a: "999999" }, { q: "123456 + 1 = ?", a: "123457" },
        { q: "250000 + 750000 = ?", a: "1000000" }, { q: "500000 - 250000 = ?", a: "250000" }, { q: "123000 + 456000 = ?", a: "579000" }, { q: "987000 - 123000 = ?", a: "864000" }
      ],
      "Multiplication & Division": [
        { q: "125 x 8 = ?", a: "1000" }, { q: "25 x 40 = ?", a: "1000" }, { q: "8000 : 25 = ?", a: "320" }, { q: "150 x 20 = ?", a: "3000" }, { q: "4500 : 50 = ?", a: "90" },
        { q: "12 x 125 = ?", a: "1500" }, { q: "1000 : 8 = ?", a: "125" }, { q: "250 x 4 = ?", a: "1000" }, { q: "5000 : 20 = ?", a: "250" }, { q: "11 x 11 = ?", a: "121" }
      ],
      "Fractions & Operations": [
        { q: "1/2 + 1/4 = ?", a: "3/4" }, { q: "1 - 1/3 = ?", a: "2/3" }, { q: "3/5 + 2/5 = ?", a: "1" },
        { q: "1/4 + 3/4 = ?", a: "1" }, { q: "2/7 + 3/7 = ?", a: "5/7" }, { q: "1/2 x 1/3 = ?", a: "1/6" }, { q: "3/4 x 4 = ?", a: "3" },
        { q: "1/4 x 1/2 = ?", a: "1/8" }
      ],
      "Perimeter & Area": [
        { q: "Perimeter of rectangle length 8cm, width 5cm?", a: "26" }, { q: "Area of square with side 7cm?", a: "49" },
        { q: "Perimeter of square with side 10cm?", a: "40" }, { q: "Area of rectangle length 12cm, width 4cm?", a: "48" }, { q: "A rectangle has perimeter 20cm and length 6cm. Width?", a: "4" }
      ]
    },
    "Grade 5": {
      "Decimals & Operations": [
        { q: "0.5 + 0.25 = ?", a: "0.75" }, { q: "1.2 - 0.4 = ?", a: "0.8" }, { q: "2.5 x 4 = ?", a: "10" }, { q: "10 : 2.5 = ?", a: "4" },
        { q: "0.1 + 0.9 = ?", a: "1" }, { q: "5.5 - 1.5 = ?", a: "4" }, { q: "1.5 x 2 = ?", a: "3" }, { q: "12 : 0.5 = ?", a: "24" },
        { q: "3.4 + 6.6 = ?", a: "10" }, { q: "9.8 - 4.3 = ?", a: "5.5" }
      ],
      "Perimeter, Area & Volume": [
        { q: "Area of triangle with base 10 and height 5?", a: "25" }, { q: "Circumference of circle with diameter 10 (pi = 3.14)?", a: "31.4" }, { q: "Area of trapezoid with bases 4, 6 and height 5?", a: "25" },
        { q: "Volume of cube with side 2 cm?", a: "8" }, { q: "Volume of rectangular prism with edges 2, 3, 4?", a: "24" }, { q: "Total surface area of cube with side 1?", a: "6" }
      ],
      "Speed, Distance & Time": [
        { q: "2 hours 30 minutes = ? minutes", a: "150" }, { q: "Speed 60 km/h, time 2 hours. Distance?", a: "120" },
        { q: "Distance 100 km, speed 50 km/h. Time?", a: "2" }, { q: "Speed 15 m/s, time 10 seconds. Distance?", a: "150" }
      ],
      "Percentages": [
        { q: "Percentage ratio of 2 and 5?", a: "40%" }, { q: "Percentage ratio of 1 and 4?", a: "25%" }, { q: "20% of 100 = ?", a: "20" }, { q: "In a box with 3 blue and 7 red marbles, percentage of blue?", a: "30%" }
      ]
    }
  }
};
