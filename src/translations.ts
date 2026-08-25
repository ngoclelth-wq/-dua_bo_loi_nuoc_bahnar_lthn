import { Language } from './types';

export const TRANSLATIONS = {
  vi: {
    headerTitle: "ĐUA BÒ LỘI NƯỚC (RƠMO LĂT ĐAK PƠLONG)",
    musicOn: "Bật nhạc",
    musicOff: "Tắt nhạc",
    introTooltip: "Giới thiệu trò chơi",
    rulesTooltip: "Luật chơi",
    teacherTooltip: "Chế độ giáo viên",
    pause: "Tạm dừng",
    resume: "Tiếp tục",
    pausedBadge: "⏸️ TẠM DỪNG",
    secondsSuffix: "GIÂY",
    pausedOverlay: "ĐANG TẠM DỪNG",
    
    // Team & Turn labels
    you: "Bạn",
    computer: "Máy tính",
    teamA: "Đội A",
    teamB: "Đội B",
    player: "Người chơi",
    
    // Countdown
    startSignal: "XUẤT PHÁT!",
    
    // Game modes
    mode2Players: "2 NGƯỜI CHƠI",
    modeAI: "ĐẤU VỚI MÁY",
    modeTimeTrial: "THỬ THÁCH",
    chooseCharacter: "Chọn nhân vật của bạn",
    startBtn: "BẮT ĐẦU",
    
    // Gameplay
    aiThinking: "MÁY ĐANG NGHĨ...",
    inputPlaceholder: "Đáp án...",
    waitingPlaceholder: "Đợi...",
    submitBtn: "GỬI",
    
    // Feedback
    correctFeedback: "Chính xác! Bò tiến lên!",
    wrongFeedbackTurn: "Chưa chính xác! Lượt của đối thủ.",
    wrongFeedbackNew: "Chưa chính xác! Câu hỏi mới.",
    timeUpFeedback: "Hết thời gian suy nghĩ!",
    aiCorrectFeedback: "Máy tính đã trả lời đúng!",
    aiWrongFeedback: "Máy tính trả lời sai!",
    
    // Win Screen
    timeTrialWon: (time: number) => `HOÀN THÀNH! THỜI GIAN: ${time} GIÂY`,
    drawResult: "HÒA NHAU! CẢ HAI ĐỀU RẤT GIỎI!",
    teamWon: (teamName: string) => `${teamName} THẮNG CUỘC!`,
    correctCount: (count: number) => `Bạn đã trả lời đúng ${count} câu hỏi!`,
    playAgain: "CHƠI LẠI",
    mainMenu: "MENU CHÍNH",
    
    // Rules Modal
    rulesTitle: "Luật chơi",
    rules: [
      "Khi có hiệu lệnh “1, 2, 3!”, người chơi bắt đầu di chuyển về đích.",
      "Trên đường đi, người chơi phải vượt qua các chướng ngại vật là các câu hỏi Toán học.",
      "Mỗi câu hỏi, người chơi phải trả lời đúng mới được tiếp tục di chuyển.",
      "Nếu trả lời sai, người chơi phải nhường quyền trả lời cho đội khác; sau đó mới được tiếp tục khi có lượt mới.",
      "Người chơi về đích sớm nhất là người chiến thắng."
    ],
    understood: "Đã hiểu!",
    
    // Intro Modal
    introTitle: "Giới thiệu trò chơi",
    introSubtitle: "ĐUA BÒ LỘI NƯỚC (RƠMO LĂT ĐAK PƠLONG)",
    introP1: "Người Bahnar thường quý bò hơn trâu. Bởi vì trâu chỉ dùng trong việc mua bán, trao đổi hàng hóa (đổi nồi đồng, ghè quý) hoặc dùng làm vật hiến tế thần linh. Trâu chỉ là tài sản của tầng lớp giàu có chứ không phải của tất cả người dân Bahnar. Mặc dù bò ít khi đóng vai trò làm vật hiến sinh, nhưng ngoài việc mua bán, trao đổi các đồ vật quý thì người Bahnar còn dùng bò để kéo xe và cày đất trồng trọt. Bò cũng thường được dùng làm thực phẩm chủ yếu trong đám cưới, đám tang của người Bahnar. Mỗi gia đình Bahnar đều có nuôi bò; nhà nghèo thì nuôi vài con, còn nhà giàu thì nuôi vài chục thậm chí hàng trăm con. Vì thế, người Bahnar thường hay tổ chức đua bò như một trò tiêu khiển trong lúc nông nhàn hay dịp lễ hội.",
    introP2: "Đua bò lội nước là một trò chơi đơn giản, gắn liền với công việc của trẻ em Bahnar trước đây, giúp trẻ rèn luyện khả năng điều khiển vật nuôi. Tuy nhiên, trò chơi này hiện nay không còn. Một phần vì hiện nay hầu hết trẻ em người Bahnar đều được cắp sách đến trường, ít khi các em phải chăn bò. Mặt khác số lượng bò của dân làng hiện nay không nhiều và không chăn thả tập trung như xưa.",
    closeBtn: "Đóng",
    
    // Teacher Mode
    teacherTitle: "Quản lý câu hỏi",
    selectGrade: "Chọn khối lớp",
    selectTopic: "Chọn chủ đề",
    usePresetBtn: "SỬ DỤNG BỘ CÂU HỎI CÓ SẴN THEO CHỦ ĐỀ",
    timeLimitLabel: "Thời gian tối đa để trả lời một câu hỏi (Giây)",
    timeLimitHint: "Áp dụng cho chế độ 2 Người chơi & Đấu với Máy. Nhập 0 để không giới hạn.",
    secondsUnit: "GIÂY",
    removeLimitBtn: "XÓA GIỚI HẠN",
    addCustomTitle: "Hoặc tự nhập câu hỏi mới",
    questionInputPlaceholder: "Câu hỏi (VD: 5 + 5)",
    answerInputPlaceholder: "Đáp án",
    questionsListTitle: (count: number) => `Danh sách câu hỏi (${count})`,
    deleteAllBtn: "XÓA TẤT CẢ",
    deleteAllConfirm: "Bạn có chắc chắn muốn xóa tất cả câu hỏi hiện tại?",
    noQuestionsMessage: "Chưa có câu hỏi nào. Hãy thêm mới hoặc chọn bộ câu hỏi có sẵn!",
    doneBtn: "XONG",
    languageSwitcherTitle: "Ngôn ngữ / Language"
  },
  en: {
    headerTitle: "WATER BULL RACING (RƠMO LĂT ĐAK PƠLONG)",
    musicOn: "Play music",
    musicOff: "Mute music",
    introTooltip: "Game introduction",
    rulesTooltip: "Game rules",
    teacherTooltip: "Teacher mode",
    pause: "Pause",
    resume: "Resume",
    pausedBadge: "⏸️ PAUSED",
    secondsSuffix: "SEC",
    pausedOverlay: "PAUSED",
    
    // Team & Turn labels
    you: "You",
    computer: "Computer",
    teamA: "Team A",
    teamB: "Team B",
    player: "Player",
    
    // Countdown
    startSignal: "GO!",
    
    // Game modes
    mode2Players: "2 PLAYERS",
    modeAI: "VS COMPUTER",
    modeTimeTrial: "TIME CHALLENGE",
    chooseCharacter: "Choose your character",
    startBtn: "START",
    
    // Gameplay
    aiThinking: "COMPUTER IS THINKING...",
    inputPlaceholder: "Your answer...",
    waitingPlaceholder: "Wait...",
    submitBtn: "SUBMIT",
    
    // Feedback
    correctFeedback: "Correct! Ox dashes forward!",
    wrongFeedbackTurn: "Incorrect! Opponent's turn.",
    wrongFeedbackNew: "Incorrect! Next question.",
    timeUpFeedback: "Time's up for thinking!",
    aiCorrectFeedback: "Computer answered correctly!",
    aiWrongFeedback: "Computer answered incorrectly!",
    
    // Win Screen
    timeTrialWon: (time: number) => `FINISHED! TIME: ${time} SECONDS`,
    drawResult: "IT'S A DRAW! BOTH PLAYED AWESOME!",
    teamWon: (teamName: string) => `${teamName} WINS!`,
    correctCount: (count: number) => `You answered ${count} questions correctly!`,
    playAgain: "PLAY AGAIN",
    mainMenu: "MAIN MENU",
    
    // Rules Modal
    rulesTitle: "Game Rules",
    rules: [
      "At the referee's command “1, 2, 3!”, racers start heading towards the finish line.",
      "Along the way, players must overcome obstacles in the form of Math questions.",
      "Players must answer correctly to advance their ox forward.",
      "If answering incorrectly, the turn passes to the opposing team with a new question.",
      "The first player to reach the finish line wins the race."
    ],
    understood: "Got it!",
    
    // Intro Modal
    introTitle: "About the Game",
    introSubtitle: "WATER BULL RACING (RƠMO LĂT ĐAK PƠLONG)",
    introP1: "The Bahnar ethnic people traditionally valued cattle (cows/oxen) highly. While buffaloes were mainly used for high-value trade or sacred sacrificial rituals by wealthy families, cattle were owned widely across households. Cattle were used for pulling carts, plowing agricultural soil, and as food during weddings and festivals. During leisure agricultural seasons and festivals, the Bahnar people organized bull/ox racing as an exciting folk recreation.",
    introP2: "Water bull racing was a traditional game linked with the life of Bahnar pastoral children, helping them practice agility and cattle handling skills in wetland fields and rivers. This educational math game brings this vibrant indigenous folk culture to life.",
    closeBtn: "Close",
    
    // Teacher Mode
    teacherTitle: "Question Manager",
    selectGrade: "Select Grade",
    selectTopic: "Select Topic",
    usePresetBtn: "USE PRESET TOPIC QUESTIONS",
    timeLimitLabel: "Max time to answer each question (Seconds)",
    timeLimitHint: "Applies to 2 Players & VS Computer modes. Enter 0 for unlimited time.",
    secondsUnit: "SEC",
    removeLimitBtn: "REMOVE LIMIT",
    addCustomTitle: "Or create a custom question",
    questionInputPlaceholder: "Question (e.g., 5 + 5)",
    answerInputPlaceholder: "Answer",
    questionsListTitle: (count: number) => `Questions List (${count})`,
    deleteAllBtn: "DELETE ALL",
    deleteAllConfirm: "Are you sure you want to delete all current questions?",
    noQuestionsMessage: "No questions yet. Add a new question or choose a preset topic above!",
    doneBtn: "DONE",
    languageSwitcherTitle: "Language / Ngôn ngữ"
  }
};
