/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, CheckCircle2, XCircle, User, Waves, Settings, Plus, Trash2, Save, X, Info } from 'lucide-react';

// --- Sound Utility ---
const playSound = (type: 'correct' | 'wrong' | 'move' | 'win') => {
  let audio: HTMLAudioElement | null = null;
  
  switch (type) {
    case 'correct':
      audio = new Audio('/dung.mp3');
      break;
    case 'wrong':
      audio = new Audio('/sai.mp3');
      break;
    case 'win':
      audio = new Audio('/dich.mp3');
      break;
    case 'move':
      // Keep synthesized splash sound for movement
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.05, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
      return;
  }

  if (audio) {
    audio.play().catch(err => console.log("Sound effect play failed:", err));
  }
};

// --- Question Bank ---
const QUESTIONS_BY_GRADE: Record<string, Record<string, { q: string, a: string }[]>> = {
  "Lớp 1": {
    "Các số từ 0 đến 10": [
      { q: "Số liền sau của 5?", a: "6" }, { q: "Số liền trước của 1?", a: "0" }, { q: "Số lớn nhất trong các số 2, 8, 5?", a: "8" }, { q: "4 thêm 1 = ?", a: "5" }, { q: "Số bé nhất trong các số 3, 1, 7?", a: "1" },
      { q: "Số đứng giữa 7 và 9?", a: "8" }, { q: "Đếm từ 0 đến 3 có bao nhiêu số?", a: "4" }, { q: "Số lớn hơn 6 nhưng nhỏ hơn 8?", a: "7" }
    ],
    "Phép cộng, phép trừ trong phạm vi 10": [
      { q: "2 + 3 = ?", a: "5" }, { q: "7 - 4 = ?", a: "3" }, { q: "5 + 5 = ?", a: "10" }, { q: "9 - 0 = ?", a: "9" }, { q: "1 + 8 = ?", a: "9" },
      { q: "10 - 6 = ?", a: "4" }, { q: "4 + 4 = ?", a: "8" }, { q: "8 - 3 = ?", a: "5" }, { q: "6 + 2 = ?", a: "8" }, { q: "7 - 5 = ?", a: "2" }
    ],
    "Các số đến 100, Phép cộng, phép trừ (không nhớ) trong phạm vi 100": [
      { q: "Số liền sau của 19?", a: "20" }, { q: "Số liền trước của 50?", a: "49" }, { q: "Số lớn nhất có hai chữ số?", a: "99" }, { q: "Số bé nhất có hai chữ số?", a: "10" }, { q: "Số 45 gồm mấy chục và mấy đơn vị?", a: "4 chục 5 đơn vị" },
      { q: "Số tròn chục lớn nhất nhỏ hơn 100?", a: "90" }, { q: "Số 7 chục và 0 đơn vị là số nào?", a: "70" }, { q: "99 + 1 = ?", a: "100" },
      { q: "30 + 20 = ?", a: "50" }, { q: "80 - 40 = ?", a: "40" }, { q: "42 + 5 = ?", a: "47" }, { q: "67 - 7 = ?", a: "60" }, { q: "21 + 34 = ?", a: "55" },
      { q: "99 - 11 = ?", a: "88" }, { q: "50 + 7 = ?", a: "57" }, { q: "45 - 20 = ?", a: "25" }
    ],
    "Thời gian, giờ và lịch": [
      { q: "Một tuần lễ có mấy ngày?", a: "7 ngày" }, { q: "Kim dài chỉ số 12, kim ngắn chỉ số 3 là mấy giờ?", a: "3 giờ" }, { q: "Hôm nay là thứ Hai, ngày mai là thứ mấy?", a: "Thứ Ba" }, { q: "Một ngày có bao nhiêu giờ?", a: "24 giờ" }, { q: "Đồng hồ chỉ 10 giờ thì kim ngắn chỉ số mấy?", a: "10" }
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
    "phép nhân, phép chia": [
      { q: "2 x 6 = ?", a: "12" }, { q: "5 x 4 = ?", a: "20" }, { q: "10 : 2 = ?", a: "5" }, { q: "25 : 5 = ?", a: "5" }, { q: "2 x 9 = ?", a: "18" },
      { q: "5 x 8 = ?", a: "40" }, { q: "14 : 2 = ?", a: "7" }, { q: "45 : 5 = ?", a: "9" }, { q: "2 x 7 = ?", a: "14" }, { q: "35 : 5 = ?", a: "7" }
    ],
    "các số trong phạm vi 1000": [
      { q: "Số lớn nhất có ba chữ số?", a: "999" }, { q: "Số liền sau của 999?", a: "1000" }, { q: "Số 354 gồm mấy trăm, mấy chục, mấy đơn vị?", a: "3 trăm 5 chục 4 đơn vị" }, { q: "Số bé nhất có ba chữ số?", a: "100" }, { q: "Số gồm 5 trăm và 2 đơn vị?", a: "502" }
    ],
    "phép cộng, phép trừ trong phạm vi 1000": [
      { q: "200 + 300 = ?", a: "500" }, { q: "700 - 400 = ?", a: "300" }, { q: "120 + 50 = ?", a: "170" }, { q: "450 - 30 = ?", a: "420" }, { q: "500 + 500 = ?", a: "1000" },
      { q: "350 + 150 = ?", a: "500" }, { q: "900 - 250 = ?", a: "650" }, { q: "600 + 400 = ?", a: "1000" }, { q: "850 - 50 = ?", a: "800" }, { q: "100 + 900 = ?", a: "1000" }
    ],
    "làm quen với yếu tố thống kê, xác suất": [
      { q: "Trong túi có 2 bi đỏ, 1 bi xanh. Lấy 1 bi, khả năng cao là bi màu gì?", a: "Màu đỏ" }, { q: "Gieo xúc xắc, mặt có 7 chấm có thể xuất hiện không?", a: "Không" }, { q: "Có 3 quả cam và 2 quả táo, tổng số quả?", a: "5 quả" },
      { q: "Khả năng lấy được bi vàng trong túi chỉ có bi đỏ?", a: "Không thể" }, { q: "Có 4 con thỏ và 3 con gà, tổng số chân thỏ?", a: "16 chân" }
    ]
  },
  "Lớp 3": {
    "bảng nhân, bảng chia": [
      { q: "6 x 8 = ?", a: "48" }, { q: "7 x 9 = ?", a: "63" }, { q: "42 : 6 = ?", a: "7" }, { q: "56 : 7 = ?", a: "8" }, { q: "8 x 4 = ?", a: "32" },
      { q: "9 x 5 = ?", a: "45" }, { q: "64 : 8 = ?", a: "8" }, { q: "81 : 9 = ?", a: "9" }, { q: "7 x 6 = ?", a: "42" }, { q: "49 : 7 = ?", a: "7" }
    ],
    "phép nhân, phép chia trong phạm vi 100": [
      { q: "12 x 4 = ?", a: "48" }, { q: "15 x 3 = ?", a: "45" }, { q: "60 : 5 = ?", a: "12" }, { q: "84 : 4 = ?", a: "21" }, { q: "11 x 9 = ?", a: "99" },
      { q: "24 x 2 = ?", a: "48" }, { q: "13 x 5 = ?", a: "65" }, { q: "75 : 3 = ?", a: "25" }, { q: "96 : 6 = ?", a: "16" }, { q: "14 x 7 = ?", a: "98" }
    ],
    "phép chia trong phạm vi 1000": [
      { q: "400 : 2 = ?", a: "200" }, { q: "900 : 3 = ?", a: "300" }, { q: "150 : 5 = ?", a: "30" }, { q: "240 : 6 = ?", a: "40" }, { q: "1000 : 8 = ?", a: "125" },
      { q: "500 : 4 = ?", a: "125" }, { q: "720 : 9 = ?", a: "80" }, { q: "640 : 8 = ?", a: "80" }, { q: "360 : 4 = ?", a: "90" }, { q: "810 : 9 = ?", a: "90" }
    ],
    "các số đến 10000": [
      { q: "Số lớn nhất có bốn chữ số?", a: "9999" }, { q: "Số liền sau của 9999?", a: "10000" }, { q: "5000 + 5000 = ?", a: "10000" }, { q: "Số bé nhất có bốn chữ số?", a: "1000" }, { q: "Số 7856 gồm mấy nghìn?", a: "7 nghìn" }
    ],
    "chu vi, diện tích một số hình phẳng": [
      { q: "Chu vi hình vuông cạnh 5 xăng-ti-mét?", a: "20 xăng-ti-mét" }, { q: "Diện tích hình chữ nhật cạnh 4 và 6 xăng-ti-mét?", a: "24 xăng-ti-mét vuông" }, { q: "Chu vi hình chữ nhật dài 7, rộng 3 xăng-ti-mét?", a: "20 xăng-ti-mét" }, { q: "Diện tích hình vuông cạnh 4 xăng-ti-mét?", a: "16 xăng-ti-mét vuông" }, { q: "Một hình chữ nhật có chiều dài 10cm, chiều rộng bằng một nửa chiều dài. Diện tích?", a: "50 xăng-ti-mét vuông" }
    ],
    "cộng, trừ, nhân, chia trong phạm vi 10000": [
      { q: "2000 + 3000 = ?", a: "5000" }, { q: "8000 - 5000 = ?", a: "3000" }, { q: "1200 x 4 = ?", a: "4800" }, { q: "9000 : 3 = ?", a: "3000" }, { q: "4500 + 2500 = ?", a: "7000" },
      { q: "6000 - 1500 = ?", a: "4500" }, { q: "2500 x 3 = ?", a: "7500" }, { q: "8400 : 4 = ?", a: "2100" }, { q: "3300 + 6700 = ?", a: "10000" }, { q: "10000 - 4500 = ?", a: "5500" }
    ],
    "các số đến 100000": [
      { q: "Số lớn nhất có năm chữ số?", a: "99999" }, { q: "Số bé nhất có năm chữ số?", a: "10000" }, { q: "Số 100000 gồm mấy chữ số?", a: "6 chữ số" }, { q: "Số liền trước của 100000?", a: "99999" }, { q: "Số 45678 đọc là gì?", a: "Bốn mươi lăm nghìn sáu trăm bảy mươi tám" }
    ],
    "cộng, trừ trong phạm vi 100000": [
      { q: "20000 + 30000 = ?", a: "50000" }, { q: "100000 - 50000 = ?", a: "50000" }, { q: "45000 + 5000 = ?", a: "50000" }, { q: "75000 - 25000 = ?", a: "50000" }, { q: "12345 + 54321 = ?", a: "66666" },
      { q: "60000 + 40000 = ?", a: "100000" }, { q: "90000 - 45000 = ?", a: "45000" }, { q: "32000 + 18000 = ?", a: "50000" }, { q: "88000 - 22000 = ?", a: "66000" }, { q: "15000 + 85000 = ?", a: "100000" }
    ],
    "nhân, chia trong phạm vi 100000": [
      { q: "12000 x 5 = ?", a: "60000" }, { q: "80000 : 2 = ?", a: "40000" }, { q: "25000 x 4 = ?", a: "100000" }, { q: "99000 : 9 = ?", a: "11000" }, { q: "15000 x 3 = ?", a: "45000" },
      { q: "11000 x 8 = ?", a: "88000" }, { q: "60000 : 3 = ?", a: "20000" }, { q: "14000 x 5 = ?", a: "70000" }, { q: "48000 : 6 = ?", a: "8000" }, { q: "20000 x 4 = ?", a: "80000" }
    ],
    "làm quen với yếu tố thống kê, xác suất": [
      { q: "Có 5 quả bóng xanh, 5 quả đỏ. Lấy 1 quả, khả năng lấy được bóng xanh?", a: "Một nửa" }, { q: "Trong các số 450, 600, 320, số lớn nhất?", a: "600" },
      { q: "Khả năng chọn được một ngày có 25 giờ?", a: "Không thể" }, { q: "Nếu tung một đồng xu, có mấy kết quả có thể xảy ra?", a: "2 kết quả" }, { q: "Trong một tuần, khả năng ngày mai là Chủ nhật nếu hôm nay là thứ Bảy?", a: "Chắc chắn" }
    ]
  },
  "Lớp 4": {
    "số có nhiều chữ số": [
      { q: "Số gồm 5 triệu, 2 trăm nghìn và 3 đơn vị viết là?", a: "5200003" }, { q: "Giá trị chữ số 7 trong số 745000?", a: "700000" }, { q: "Số lớn nhất có sáu chữ số?", a: "999999" },
      { q: "Số 1000000 đọc là gì?", a: "Một triệu" }, { q: "Lớp triệu gồm những hàng nào?", a: "Hàng triệu, hàng chục triệu, hàng trăm triệu" }
    ],
    "phép cộng và phép trừ": [
      { q: "450000 + 550000 = ?", a: "1000000" }, { q: "1000000 - 1 = ?", a: "999999" }, { q: "123456 + 1 = ?", a: "123457" },
      { q: "Hiệu của số lớn nhất có năm chữ số và số bé nhất có năm chữ số?", a: "89999" }, { q: "Số nào + 0 thì bằng chính nó?", a: "Mọi số" },
      { q: "250000 + 750000 = ?", a: "1000000" }, { q: "500000 - 250000 = ?", a: "250000" }, { q: "123000 + 456000 = ?", a: "579000" }, { q: "987000 - 123000 = ?", a: "864000" }, { q: "654321 - 123456 = ?", a: "530865" }
    ],
    "phép nhân và phép chia": [
      { q: "125 x 8 = ?", a: "1000" }, { q: "25 x 40 = ?", a: "1000" }, { q: "8000 : 25 = ?", a: "320" }, { q: "150 x 20 = ?", a: "3000" }, { q: "4500 : 50 = ?", a: "90" },
      { q: "12 x 125 = ?", a: "1500" }, { q: "1000 : 8 = ?", a: "125" }, { q: "250 x 4 = ?", a: "1000" }, { q: "5000 : 20 = ?", a: "250" }, { q: "11 x 11 = ?", a: "121" }
    ],
    "làm quen với yếu tố thống kê, xác suất": [
      { q: "Trung bình cộng của 10, 20 và 30?", a: "20" }, { q: "Khả năng xảy ra của một sự kiện chắc chắn?", a: "100%" },
      { q: "Trung bình cộng của 4 và 6?", a: "5" }, { q: "Số trung bình cộng của các số 1, 2, 3, 4, 5?", a: "3" }, { q: "Cột cao nhất trong biểu đồ cột chỉ giá trị gì?", a: "Giá trị lớn nhất" }
    ],
    "phân số": [
      { q: "Phân số nào bằng 1/2?", a: "2/4" }, { q: "Rút gọn phân số 5/10?", a: "1/2" }, { q: "Tử số của phân số 3/4?", a: "3" },
      { q: "Mẫu số của phân số 5/6?", a: "6" }, { q: "Phân số có tử số bằng mẫu số?", a: "1" }
    ],
    "các phép tính với phân số": [
      { q: "1/2 + 1/4 = ?", a: "3/4" }, { q: "1 - 1/3 = ?", a: "2/3" }, { q: "3/5 + 2/5 = ?", a: "1" },
      { q: "5/8 - 3/8 = ?", a: "2/8 hoặc 1/4" }, { q: "2/7 + 3/7 = ?", a: "5/7" },
      { q: "1/4 + 3/4 = ?", a: "1" }, { q: "5/6 - 1/6 = ?", a: "4/6 hoặc 2/3" }, { q: "2/9 + 5/9 = ?", a: "7/9" }, { q: "7/10 - 3/10 = ?", a: "4/10 hoặc 2/5" }, { q: "1/5 + 1/5 = ?", a: "2/5" },
      { q: "1/2 x 1/3 = ?", a: "1/6" }, { q: "2/3 : 1/2 = ?", a: "4/3" }, { q: "3/4 x 4 = ?", a: "3" },
      { q: "5/6 : 5 = ?", a: "1/6" }, { q: "2/5 x 5/2 = ?", a: "1" },
      { q: "1/4 x 1/2 = ?", a: "1/8" }, { q: "3/5 : 2 = ?", a: "3/10" }, { q: "2/7 x 7 = ?", a: "2" }, { q: "4/9 : 2 = ?", a: "2/9" }, { q: "1/3 x 3/4 = ?", a: "1/4" }
    ],
    "chu vi và diện tích": [
      { q: "Chu vi hình chữ nhật dài 8cm, rộng 5cm?", a: "26cm" }, { q: "Diện tích hình vuông cạnh 7cm?", a: "49cm2" },
      { q: "Chu vi hình vuông cạnh 10cm?", a: "40cm" }, { q: "Diện tích hình chữ nhật dài 12cm, rộng 4cm?", a: "48cm2" }, { q: "Một hình chữ nhật có chu vi 20cm, chiều dài 6cm. Chiều rộng?", a: "4cm" }
    ]
  },
  "Lớp 5": {
    "số thập phân": [
      { q: "Viết phân số 1/2 dưới dạng số thập phân?", a: "0,5" }, { q: "Số thập phân gồm 5 đơn vị và 2 phần mười?", a: "5,2" }, { q: "Số 0,75 đọc là gì?", a: "Không phẩy bảy mươi lăm" },
      { q: "Số 3,14 có mấy chữ số ở phần thập phân?", a: "2 chữ số" }, { q: "Số thập phân có: Bảy đơn vị, năm phần mười, bốn phần trăm?", a: "7,54" }
    ],
    "các phép tính với số thập phân": [
      { q: "0,5 + 0,25 = ?", a: "0,75" }, { q: "1,2 - 0,4 = ?", a: "0,8" }, { q: "2,5 x 4 = ?", a: "10" }, { q: "10 : 2,5 = ?", a: "4" },
      { q: "0,1 + 0,9 = ?", a: "1" }, { q: "5,5 - 1,5 = ?", a: "4" }, { q: "1,5 x 2 = ?", a: "3" }, { q: "12 : 0,5 = ?", a: "24" },
      { q: "3,4 + 6,6 = ?", a: "10" }, { q: "9,8 - 4,3 = ?", a: "5,5" }
    ],
    "chu vi và diện tích": [
      { q: "Diện tích tam giác có đáy 10, chiều cao 5?", a: "25" }, { q: "Chu vi hình tròn có đường kính 10 (số pi = 3,14)?", a: "31,4" }, { q: "Diện tích hình thang có đáy 4, 6 và chiều cao 5?", a: "25" },
      { q: "Diện tích hình tròn bán kính 2 (số pi = 3,14)?", a: "12,56" }, { q: "Chu vi hình tròn bán kính 5 (số pi = 3,14)?", a: "31,4" }
    ],
    "thể tích, đơn vị đo thể tích": [
      { q: "1 mét khối = ? đề-xi-mét khối", a: "1000" }, { q: "1 lít = ? xăng-ti-mét khối", a: "1000" }, { q: "Thể tích hình lập phương cạnh 2 xăng-ti-mét?", a: "8 xăng-ti-mét khối" },
      { q: "Xăng-ti-mét khối là đơn vị đo gì?", a: "Thể tích" }, { q: "1 đề-xi-mét khối = ? xăng-ti-mét khối", a: "1000" }
    ],
    "diện tích và thể tích của một số hình khối": [
      { q: "Thể tích hình hộp chữ nhật có cạnh 2, 3, 4?", a: "24" }, { q: "Diện tích toàn phần hình lập phương cạnh 1?", a: "6" },
      { q: "Diện tích xung quanh hình lập phương cạnh 2?", a: "16" }, { q: "Thể tích hình lập phương cạnh 3?", a: "27" }, { q: "Một hình hộp chữ nhật có diện tích đáy 20, chiều cao 5. Thể tích?", a: "100" }
    ],
    "số đo thời gian, vận tốc. các bài toán liên quan đến chuyển động đều": [
      { q: "2 giờ 30 phút = ? phút", a: "150 phút" }, { q: "Vận tốc 60 ki-lô-mét trên giờ, thời gian 2 giờ. Quãng đường?", a: "120 ki-lô-mét" },
      { q: "Quãng đường 100 ki-lô-mét, vận tốc 50 ki-lô-mét trên giờ. Thời gian?", a: "2 giờ" }, { q: "Vận tốc 15 mét trên giây, thời gian 10 giây. Quãng đường?", a: "150 mét" }, { q: "Công thức tính vận tốc?", a: "v = s / t" }
    ],
    "một số yếu tố thống kê xác suất": [
      { q: "Tỉ số phần trăm của 2 và 5?", a: "40%" }, { q: "Trong biểu đồ hình quạt, tổng các thành phần bằng bao nhiêu phần trăm?", a: "100%" },
      { q: "Tỉ số phần trăm của 1 và 4?", a: "25%" }, { q: "20% của 100 = ?", a: "20" }, { q: "Trong một hộp có 3 bi xanh, 7 bi đỏ. Tỉ số phần trăm bi xanh?", a: "30%" }
    ]
  }
};

// --- Components ---

const OxSprite = ({ team, label }: { team: string, label?: string }) => {
  const imgSrc = team === 'A' ? '/nam.png' : '/nu.png';
  return (
    <div className="relative flex items-center">
        <motion.img
        src={imgSrc}
        alt={label || `Đội ${team}`}
        referrerPolicy="no-referrer"
        className="w-28 sm:w-32 h-auto drop-shadow-2xl"
        animate={{ 
          y: [0, -6, 0],
          rotate: team === 'A' ? [-1, 1, -1] : [1, -1, 1]
        }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      />
      <div className={`ml-2 px-3 py-0.5 rounded-full font-bold text-white shadow-lg text-lg ${team === 'A' ? 'bg-blue-600 border-2 border-white' : 'bg-red-600 border-2 border-white'}`}>
        {label || `Đội ${team}`}
      </div>
    </div>
  );
};

export default function App() {
  const [selectedGrade, setSelectedGrade] = useState("Lớp 1");
  const [selectedTopic, setSelectedTopic] = useState(Object.keys(QUESTIONS_BY_GRADE["Lớp 1"])[0]);
  const [questionsList, setQuestionsList] = useState(QUESTIONS_BY_GRADE["Lớp 1"][Object.keys(QUESTIONS_BY_GRADE["Lớp 1"])[0]]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [gameState, setGameState] = useState<'start' | 'countdown' | 'playing' | 'won'>('start');
  const [gameMode, setGameMode] = useState<'multiplayer' | 'ai' | 'time-trial'>('multiplayer');
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [countdownValue, setCountdownValue] = useState<number | string>(3);
  const [teamATurn, setTeamATurn] = useState(true);
  const [posA, setPosA] = useState(0);
  const [posB, setPosB] = useState(0);
  const [currentQ, setCurrentQ] = useState(questionsList[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });
  const [attempts, setAttempts] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const WIN_POS = 80; 
  const stepSize = Math.max(10, 80 / Math.ceil(questionsList.length / 1.5));

  // Update questions list when grade changes
  useEffect(() => {
    if (gameState === 'start') {
      const topics = Object.keys(QUESTIONS_BY_GRADE[selectedGrade]);
      const firstTopic = topics[0];
      setSelectedTopic(firstTopic);
      const newList = QUESTIONS_BY_GRADE[selectedGrade][firstTopic];
      setQuestionsList(newList);
      setCurrentQ(newList[0]);
      setUsedIndices([]);
    }
  }, [selectedGrade, gameState]);

  // Update questions when topic changes
  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    const newList = QUESTIONS_BY_GRADE[selectedGrade][topic];
    setQuestionsList(newList);
    setCurrentQ(newList[0]);
    setUsedIndices([]);
  };

  const nextQuestion = useCallback(() => {
    if (questionsList.length === 0) return;
    
    let availableIndices = questionsList.map((_, i) => i).filter(i => !usedIndices.includes(i));
    
    if (availableIndices.length === 0) {
      availableIndices = questionsList.map((_, i) => i);
      setUsedIndices([]);
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setCurrentQ(questionsList[randomIndex]);
    setCurrentIndex(randomIndex);
    setAttempts(0);
    setInput('');
  }, [questionsList, usedIndices]);

  const addQuestion = () => {
    if (!newQ.trim() || !newA.trim()) return;
    const updated = [...questionsList, { q: newQ, a: newA.trim() }];
    setQuestionsList(updated);
    setUsedIndices([]); // Reset used pool when list changes
    setNewQ('');
    setNewA('');
  };

  const deleteQuestion = (index: number) => {
    const updated = questionsList.filter((_, i) => i !== index);
    setQuestionsList(updated);
    setUsedIndices([]); // Reset used pool when list changes
  };

  const startGame = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
    startCountdown();
  };

  const startCountdown = () => {
    const countdownWords = ['mĭnh', "'bar", 'pêng'];
    setGameState('countdown');
    setCountdownValue(countdownWords[0]);
    
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      if (index < countdownWords.length) {
        setCountdownValue(countdownWords[index]);
      } else if (index === countdownWords.length) {
        setCountdownValue('XUẤT PHÁT!');
      } else {
        clearInterval(timer);
        setGameState('playing');
        setPosA(0);
        setPosB(0);
        setTeamATurn(true);
        setWinner(null);
        setFeedback({ text: '', type: null });
        setUsedIndices([]);
        setScore(0);
        setTimeLeft(60);
        setIsProcessing(false);
        
        const randomIndex = Math.floor(Math.random() * questionsList.length);
        setCurrentQ(questionsList[randomIndex]);
        setCurrentIndex(randomIndex);
        setAttempts(0);
        setInput('');
      }
    }, 1000);
  };

  // Timer for Time Trial
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'time-trial') {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('won');
        setWinner('TIME_UP');
      }
    }
  }, [gameState, gameMode, timeLeft]);

  // AI Turn Logic
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'ai' && !teamATurn) {
      const aiThinkTime = 1500 + Math.random() * 2000;
      const timer = setTimeout(() => {
        // AI accuracy: 70% chance to be correct
        const isCorrect = Math.random() < 0.7;
        
        if (isCorrect) {
          playSound('correct');
          setFeedback({ text: 'Máy tính đã trả lời đúng!', type: 'success' });
          setUsedIndices(prev => [...prev, currentIndex]);
          
          const newPos = posB + stepSize;
          setPosB(newPos);
          playSound('move');
          
          if (newPos >= WIN_POS) {
            setTimeout(() => endGame('B'), 1000);
            return;
          }
          
          setTimeout(() => {
            setFeedback({ text: '', type: null });
            nextQuestion();
            setTeamATurn(true);
          }, 1200);
        } else {
          playSound('wrong');
          setFeedback({ text: 'Máy tính trả lời sai!', type: 'error' });
          setTimeout(() => {
            setFeedback({ text: '', type: null });
            nextQuestion();
            setTeamATurn(true);
          }, 1200);
        }
      }, aiThinkTime);
      return () => clearTimeout(timer);
    }
  }, [gameState, gameMode, teamATurn, currentIndex]);

  const handleAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;
    if (gameMode === 'ai' && !teamATurn) return; // Prevent player input during AI turn

    setIsProcessing(true);
    const isCorrect = input.trim().toLowerCase() === currentQ.a.toString().toLowerCase();

    if (isCorrect) {
      playSound('correct');
      setFeedback({ text: 'Chính xác! Bò tiến lên!', type: 'success' });
      setUsedIndices(prev => [...prev, currentIndex]);
      
      if (gameMode === 'time-trial') {
        setScore(prev => prev + 1);
        if (selectedTeam === 'A') {
          const newPos = posA + stepSize;
          if (newPos >= WIN_POS) {
            setPosA(0); // Reset position for "laps" in time trial
          } else {
            setPosA(newPos);
          }
        } else {
          const newPos = posB + stepSize;
          if (newPos >= WIN_POS) {
            setPosB(0); // Reset position for "laps" in time trial
          } else {
            setPosB(newPos);
          }
        }
        playSound('move');
        
        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setIsProcessing(false);
        }, 800);
      } else {
        if (teamATurn) {
          const newPos = posA + stepSize;
          setPosA(newPos);
          playSound('move');
          if (newPos >= WIN_POS) {
            endGame('A');
            setIsProcessing(false);
            return;
          }
        } else {
          const newPos = posB + stepSize;
          setPosB(newPos);
          playSound('move');
          if (newPos >= WIN_POS) {
            endGame('B');
            setIsProcessing(false);
            return;
          }
        }
        
        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setTeamATurn(!teamATurn);
          setIsProcessing(false);
        }, 1200);
      }

    } else {
      playSound('wrong');
      
      if (gameMode === 'time-trial') {
        setFeedback({ text: 'Chưa chính xác! Câu hỏi mới.', type: 'error' });
        setTimeout(() => {
          setFeedback({ text: '', type: null });
          nextQuestion();
          setIsProcessing(false);
        }, 1000);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 2) {
          setFeedback({ text: 'Cả hai đội đều chưa chính xác! Câu hỏi mới.', type: 'error' });
          setTimeout(() => {
            setFeedback({ text: '', type: null });
            nextQuestion();
            setTeamATurn(!teamATurn);
            setIsProcessing(false);
          }, 1200);
        } else {
          setFeedback({ text: 'Chưa chính xác! Lượt của đối thủ.', type: 'error' });
          setTimeout(() => {
            setFeedback({ text: '', type: null });
            setTeamATurn(!teamATurn);
            setInput('');
            setIsProcessing(false);
          }, 1200);
        }
      }
    }
  };

  const endGame = (team: string) => {
    playSound('win');
    setWinner(team);
    setGameState('won');
  };

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, teamATurn]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-sky-100 font-sans overflow-hidden flex flex-col">
      <audio ref={audioRef} src="/nhacnen.mp3" loop />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm py-2 px-3 shadow-sm flex justify-between items-center z-10">
  <h1 className="text-lg font-bold text-orange-600 tracking-tight uppercase">
    ĐUA BÒ LỘI NƯỚC (RƠMO LĂT ĐAK PƠLONG)
  </h1>

    <div className="flex gap-2 items-center">
      {gameMode === 'time-trial' && gameState === 'playing' && (
        <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full border-2 border-orange-500 animate-pulse">
          <span className="text-orange-600 font-black text-sm">⏱️ {timeLeft}s</span>
          <span className="text-orange-600 font-black text-sm">⭐ {score}</span>
        </div>
      )}
      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
      <button 
        onClick={toggleMute}
        className="text-gray-500 hover:text-orange-600 transition-colors"
        title={isMuted ? "Bật nhạc" : "Tắt nhạc"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        )}
      </button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume} 
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-16 h-1 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
    </div>
    <button 
      onClick={() => setIsIntroOpen(true)}
      className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
      title="Giới thiệu trò chơi"
    >
      <Info size={20} />
    </button>
    <button 
      onClick={() => setIsRulesOpen(true)}
      className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
      title="Luật chơi"
    >
      <div className="w-5 h-5 flex items-center justify-center font-black border-2 border-current rounded-full text-xs">?</div>
    </button>
    <button 
      onClick={() => setIsTeacherMode(true)}
      className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
      title="Chế độ giáo viên"
    >
      <Settings size={20} />
    </button>

    {gameMode !== 'time-trial' && (
      <>
        <div className={`px-3 py-0.5 text-sm rounded-full font-bold transition-all ${
          teamATurn ? 'bg-blue-500 text-white scale-105 shadow-md' : 'bg-gray-200 text-gray-500'
        }`}>
          {gameMode === 'ai' ? 'Bạn' : 'Đội A'}
        </div>

        <div className={`px-3 py-0.5 text-sm rounded-full font-bold transition-all ${
          !teamATurn ? 'bg-red-500 text-white scale-105 shadow-md' : 'bg-gray-200 text-gray-500'
        }`}>
          {gameMode === 'ai' ? 'Máy tính' : 'Đội B'}
        </div>
      </>
    )}
  </div>
</header>

      {/* Main Game Area */}
      <main 
        className="flex-1 relative flex flex-col"
        style={{
          backgroundImage: "url('/nen.png')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* The Lake/Track */}
        <div className="flex-1 relative border-y-4 border-amber-800/20 bg-transparent">
                {/* Finish Line (Visual Gate) */}
          <div className="absolute right-[12%] top-0 bottom-0 w-1 bg-white/30 backdrop-blur-[2px] z-10" />

          {/* Oxen */}
          <div className="absolute inset-0 flex flex-col justify-around py-8 px-[5%]">
            {/* Team A Ox */}
            <motion.div 
              animate={{ x: `${posA}%` }}
              transition={{ type: 'spring', stiffness: 40 }}
              className={`relative z-20 ${gameMode === 'time-trial' && selectedTeam === 'B' ? 'opacity-40 grayscale' : ''}`}
            >
              <OxSprite team="A" label={gameMode === 'ai' ? 'Bạn' : gameMode === 'time-trial' ? (selectedTeam === 'A' ? 'Người chơi' : 'Đội A') : 'Đội A'} />
            </motion.div>

            {/* Team B Ox */}
            <motion.div 
              animate={{ x: `${posB}%` }}
              transition={{ type: 'spring', stiffness: 40 }}
              className={`relative z-20 ${gameMode === 'time-trial' && selectedTeam === 'A' ? 'opacity-40 grayscale' : ''}`}
            >
              <OxSprite team="B" label={gameMode === 'ai' ? 'Máy tính' : gameMode === 'time-trial' ? (selectedTeam === 'B' ? 'Người chơi' : 'Đội B') : 'Đội B'} />
            </motion.div>
          </div>

          <AnimatePresence>
            {gameState === 'countdown' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]"
              >
                <div className="flex flex-col items-center gap-4 translate-y-12">
                  {/* Speech Bubble */}
                  <motion.div
                    key={countdownValue}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="relative bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-3xl shadow-2xl border-4 border-orange-500 flex items-center justify-center min-w-[200px] sm:min-w-[300px]"
                  >
                    <span className="text-3xl sm:text-5xl font-black text-orange-600 uppercase italic whitespace-nowrap">
                      {countdownValue}
                    </span>
                    {/* Bubble Tail */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-r-4 border-b-4 border-orange-500 rotate-45" />
                  </motion.div>

                  <motion.img 
                    src="/trongtai.png" 
                    alt="Trọng tài" 
                    className="w-40 sm:w-56 h-auto drop-shadow-2xl"
                    animate={{ 
                      y: [0, -5, 0],
                      scale: [1, 1.01, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isRulesOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px] p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 10 }}
                  className="bg-white/95 rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-orange-500 relative overflow-y-auto max-h-[95%]"
                >
                  <button 
                    onClick={() => setIsRulesOpen(false)}
                    className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500" />
                  <h2 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-2 uppercase italic">
                    <Settings size={24} className="animate-spin-slow" /> Luật chơi
                  </h2>
                  
                  <ul className="space-y-3 text-gray-700 font-bold text-base">
                    <li className="flex gap-2">
                      <div className="min-w-[24px] h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs">1</div>
                      Khi có hiệu lệnh “1, 2, 3!”, người chơi bắt đầu di chuyển về đích.
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[24px] h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs">2</div>
                      Trên đường đi, người chơi phải vượt qua các chướng ngại vật là các câu hỏi Toán học.
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[24px] h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs">3</div>
                      Mỗi câu hỏi, người chơi phải trả lời đúng mới được tiếp tục di chuyển.
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[24px] h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">4</div>
                      Nếu trả lời sai, người chơi phải nhường quyền trả lời cho đội khác; sau đó mới được tiếp tục khi có lượt mới.
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[24px] h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">5</div>
                      Người chơi về đích sớm nhất là người chiến thắng.
                    </li>
                  </ul>

                  <button
                    onClick={() => setIsRulesOpen(false)}
                    className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-black shadow-lg transition-colors uppercase tracking-widest"
                  >
                    Đã hiểu!
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Introduction Modal */}
          <AnimatePresence>
            {isIntroOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px] p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 10 }}
                  className="bg-white/95 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-4 border-orange-500 relative overflow-y-auto max-h-[95%]"
                >
                  <button 
                    onClick={() => setIsIntroOpen(false)}
                    className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500" />
                  <h2 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-2 uppercase italic">
                    <Info size={24} /> Giới thiệu trò chơi
                  </h2>
                  
                  <div className="space-y-4 text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                    <p className="font-bold text-orange-700 text-lg">ĐUA BÒ LỘI NƯỚC (RƠMO LĂT ĐAK PƠLONG)</p>
                    <p>
                      Người Bahnar thường quý bò hơn trâu. Bởi vì trâu chỉ dùng trong việc mua bán, trao đổi hàng hóa (đổi nồi đồng, ghè quý) hoặc dùng làm vật hiến tế thần linh. Trâu chỉ là tài sản của tầng lớp giàu có chứ không phải của tất cả người dân Bahnar. Mặc dù bò ít khi đóng vai trò làm vật hiến sinh, nhưng ngoài việc mua bán, trao đổi các đồ vật quý thì người Bahnar còn dùng bò để kéo xe và cày đất trồng trọt. Bò cũng thường được dùng làm thực phẩm chủ yếu trong đám cưới, đám tang của người Bahnar. Mỗi gia đình Bahnar đều có nuôi bò; nhà nghèo thì nuôi vài con, còn nhà giàu thì nuôi vài chục thậm chí hàng trăm con. Vì thế, người Bahnar thường hay tổ chức đua bò như một trò tiêu khiển trong lúc nông nhàn hay dịp lễ hội.
                    </p>
                    <p>
                      Đua bò lội nước là một trò chơi đơn giản, gắn liền với công việc của trẻ em Bahnar trước đây, giúp trẻ rèn luyện khả năng điều khiển vật nuôi. Tuy nhiên, trò chơi này hiện nay không còn. Một phần vì hiện nay hầu hết trẻ em người Bahnar đều được cắp sách đến trường, ít khi các em phải chăn bò. Mặt khác số lượng bò của dân làng hiện nay không nhiều và không chăn thả tập trung như xưa.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsIntroOpen(false)}
                    className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-black shadow-lg transition-colors uppercase tracking-widest"
                  >
                    Đóng
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* UI Controls - TRANSPARENT */}
        <div className="min-h-[180px] p-3 flex flex-col items-center justify-center gap-2 z-20">
          {gameState === 'start' && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2 bg-white/60 p-1 rounded-2xl border-2 border-orange-200 shadow-sm">
                <button 
                  onClick={() => setGameMode('multiplayer')}
                  className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${gameMode === 'multiplayer' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-gray-500 hover:bg-orange-50'}`}
                >
                  2 NGƯỜI CHƠI
                </button>
                <button 
                  onClick={() => setGameMode('ai')}
                  className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${gameMode === 'ai' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-gray-500 hover:bg-orange-50'}`}
                >
                  ĐẤU VỚI MÁY
                </button>
                <button 
                  onClick={() => setGameMode('time-trial')}
                  className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${gameMode === 'time-trial' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-gray-500 hover:bg-orange-50'}`}
                >
                  THỬ THÁCH
                </button>
              </div>

              {gameMode === 'time-trial' && (
                <div className="flex flex-col items-center gap-2 mb-2">
                  <p className="text-xs font-black text-orange-700 uppercase tracking-widest">Chọn nhân vật của bạn</p>
                  <div className="flex gap-4 bg-white/40 p-2 rounded-3xl border-2 border-orange-200/50 backdrop-blur-sm">
                    <button 
                      onClick={() => setSelectedTeam('A')}
                      className={`relative p-2 rounded-2xl transition-all flex flex-col items-center gap-1 ${selectedTeam === 'A' ? 'bg-blue-500 text-white shadow-xl scale-110 ring-4 ring-blue-200' : 'bg-white/60 text-blue-600 hover:bg-blue-50 opacity-70'}`}
                    >
                      <img src="/nam.png" alt="Đội A" className="w-12 h-auto" referrerPolicy="no-referrer" />
                      <span className="text-[10px] font-black uppercase">Đội A</span>
                      {selectedTeam === 'A' && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-0.5 shadow-md">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                    <button 
                      onClick={() => setSelectedTeam('B')}
                      className={`relative p-2 rounded-2xl transition-all flex flex-col items-center gap-1 ${selectedTeam === 'B' ? 'bg-red-500 text-white shadow-xl scale-110 ring-4 ring-red-200' : 'bg-white/60 text-red-600 hover:bg-red-50 opacity-70'}`}
                    >
                      <img src="/nu.png" alt="Đội B" className="w-12 h-auto" referrerPolicy="no-referrer" />
                      <span className="text-[10px] font-black uppercase">Đội B</span>
                      {selectedTeam === 'B' && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-0.5 shadow-md">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-2xl text-xl font-black shadow-xl transition-all uppercase tracking-wider"
              >
                <Play size={24} fill="currentColor" />
                BẮT ĐẦU
              </motion.button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="w-full max-w-2xl flex flex-col items-center gap-2 px-4">
              <div className="text-center flex flex-col items-center gap-2 w-full">
                {gameMode === 'ai' && !teamATurn && (
                  <div className="flex items-center gap-2 text-orange-600 font-black animate-pulse bg-white/80 px-4 py-1 rounded-full border-2 border-orange-500 text-sm">
                    <Settings size={16} className="animate-spin" />
                    MÁY ĐANG NGHĨ...
                  </div>
                )}
                <div className="p-3 w-full flex items-center justify-center min-h-[80px]">
                  <h2 className={`font-black text-gray-900 drop-shadow-sm leading-tight text-center break-words ${
                    currentQ.q.length > 60 ? 'text-xl' : currentQ.q.length > 40 ? 'text-2xl' : 'text-4xl'
                  }`}>
                    {currentQ.q.trim().endsWith('?') ? currentQ.q : `${currentQ.q} = ?`}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleAnswer} className="flex gap-2 w-full max-w-md">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={(gameMode === 'ai' && !teamATurn) || isProcessing}
                  placeholder={(gameMode === 'ai' && !teamATurn) || isProcessing ? "Đợi..." : "Đáp án..."}
                  className="flex-1 text-xl p-1.5 border-2 border-white rounded-lg focus:border-orange-500 outline-none font-bold text-center bg-white/90 shadow-inner disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={(gameMode === 'ai' && !teamATurn) || isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-1.5 rounded-lg text-lg font-black shadow-md transition-colors disabled:bg-gray-400"
                >
                  GỬI
                </button>
              </form>

              <AnimatePresence mode="wait">
                {feedback.type && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center gap-2 text-base font-bold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {feedback.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {gameState === 'won' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-xl font-black text-orange-600">
                  <Trophy size={28} className="text-yellow-500" />
                  {gameMode === 'time-trial' ? (
                    <span>HẾT GIỜ! ĐIỂM CỦA BẠN: {score}</span>
                  ) : (
                    <span>{winner === 'A' ? 'ĐỘI A' : winner === 'B' ? (gameMode === 'ai' ? 'MÁY TÍNH' : 'ĐỘI B') : ''} THẮNG CUỘC!</span>
                  )}
                </div>
                {gameMode === 'time-trial' && (
                  <p className="text-gray-600 font-bold text-sm">Bạn đã trả lời đúng {score} câu hỏi!</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg transition-colors"
                >
                  <RotateCcw size={16} />
                  CHƠI LẠI
                </button>
                <button
                  onClick={() => setGameState('start')}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg transition-colors"
                >
                  <X size={16} />
                  MENU CHÍNH
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Teacher Mode Modal */}
      <AnimatePresence>
        {isTeacherMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-orange-50">
                <div className="flex items-center gap-3">
                  <Settings className="text-orange-600" />
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Quản lý câu hỏi</h2>
                </div>
                <button onClick={() => setIsTeacherMode(false)} className="p-2 hover:bg-orange-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Grade and Topic Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-orange-600 uppercase">Chọn khối lớp</label>
                    <select 
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-white bg-white shadow-sm font-bold outline-none focus:border-orange-500"
                    >
                      {Object.keys(QUESTIONS_BY_GRADE).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-orange-600 uppercase">Chọn chủ đề</label>
                    <select 
                      value={selectedTopic}
                      onChange={(e) => handleTopicChange(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-white bg-white shadow-sm font-bold outline-none focus:border-orange-500"
                    >
                      {Object.keys(QUESTIONS_BY_GRADE[selectedGrade]).map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button 
                      onClick={() => handleTopicChange(selectedTopic)}
                      className="w-full bg-orange-100 text-orange-700 py-3 rounded-xl font-black hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      SỬ DỤNG BỘ CÂU HỎI CÓ SẴN THEO CHỦ ĐỀ
                    </button>
                  </div>
                </div>

                {/* Add New Question */}
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Hoặc tự nhập câu hỏi mới</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Câu hỏi (VD: 5 + 5)" 
                      value={newQ}
                      onChange={(e) => setNewQ(e.target.value)}
                      className="p-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 outline-none font-bold"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Đáp án" 
                        value={newA}
                        onChange={(e) => setNewA(e.target.value)}
                        className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 outline-none font-bold"
                      />
                      <button 
                        onClick={addQuestion}
                        className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question List */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Danh sách câu hỏi ({questionsList.length})</h3>
                    {questionsList.length > 0 && (
                      <button 
                        onClick={() => {
                          if (confirm("Bạn có chắc chắn muốn xóa tất cả câu hỏi hiện tại?")) {
                            setQuestionsList([]);
                            setUsedIndices([]);
                          }
                        }}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        XÓA TẤT CẢ
                      </button>
                    )}
                  </div>
                  {questionsList.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold italic">Chưa có câu hỏi nào. Hãy thêm mới hoặc chọn bộ câu hỏi có sẵn!</p>
                    </div>
                  ) : (
                    questionsList.map((q, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-orange-200 transition-colors group">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 font-mono text-xs w-6">{idx + 1}.</span>
                        <span className="font-bold text-gray-700 text-lg">{q.q.trim().endsWith('?') ? q.q : `${q.q} = ?`}</span>
                        <span className="text-orange-600 font-black">= {q.a}</span>
                      </div>
                      <button 
                        onClick={() => deleteQuestion(idx)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                  )}
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setIsTeacherMode(false)}
                  className="bg-gray-800 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-black transition-colors"
                >
                  XONG
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
