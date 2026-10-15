/**
 * Vietnamese Holidays & Traditional Festivals Database (Ngày Lễ & Kỷ Niệm Việt Nam)
 * Based on:
 * - Bộ luật Lao động 2019 (Điều 112: Nghỉ lễ hưởng nguyên lương)
 * - Nghị định số 145/2013/NĐ-CP (Đại lễ quốc gia và nghi thức khánh tiết)
 * - Nghị định số 111/2018/NĐ-CP (Ngày truyền thống, ngày thành lập)
 * - Hệ thống lễ tiết và phong tục văn hóa dân gian Âm - Dương lịch
 *
 * Zero dependencies - Offline PWA ready.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VNHolidays = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Solar Holidays (Ngày Lễ & Kỷ Niệm Dương Lịch)
  // ---------------------------------------------------------------------------
  const SOLAR_HOLIDAYS = [
    {
      id: 'tet-duong-lich',
      day: 1,
      month: 1,
      name: 'Tết Dương Lịch',
      shortName: 'Tết Tây',
      type: 'national',
      isOff: true,
      icon: '🎆',
      meaning: 'Thời khắc khởi đầu năm mới theo chuẩn quốc tế; người lao động được nghỉ 01 ngày hưởng nguyên lương.',
      legalBasis: 'Điểm a Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'hoc-sinh-sinh-vien',
      day: 9,
      month: 1,
      name: 'Ngày Học sinh - Sinh viên Việt Nam',
      shortName: 'Học sinh - Sinh viên',
      type: 'commemoration',
      isOff: false,
      icon: '🎓',
      meaning: 'Kỷ niệm tinh thần bất khuất của học sinh Trần Văn Ơn (1950), phát động phong trào học tập và nghiên cứu sáng tạo.',
      legalBasis: 'Đại hội SV toàn quốc 1950'
    },
    {
      id: 'thanh-lap-dang',
      day: 3,
      month: 2,
      name: 'Ngày Thành lập Đảng Cộng sản Việt Nam',
      shortName: 'Thành lập Đảng',
      type: 'national',
      isOff: false,
      icon: '⭐',
      meaning: 'Hội nghị thành lập Đảng tại Hương Cảng năm 1930 dưới sự chủ tọa của đồng chí Nguyễn Ái Quốc.',
      legalBasis: 'Điều 4 Nghị định 145/2013/NĐ-CP'
    },
    {
      id: 'thay-thuoc-vn',
      day: 27,
      month: 2,
      name: 'Ngày Thầy thuốc Việt Nam',
      shortName: 'Thầy thuốc VN',
      type: 'commemoration',
      isOff: false,
      icon: '🩺',
      meaning: 'Tôn vinh y đức "Lương y như từ mẫu" theo bức thư của Chủ tịch Hồ Chí Minh gửi Hội nghị Cán bộ y tế (1955).',
      legalBasis: 'Quyết định số 39-HĐBT năm 1985'
    },
    {
      id: 'bien-phong-toan-dan',
      day: 3,
      month: 3,
      name: 'Ngày Bộ đội Biên phòng & Ngày Biên phòng Toàn dân',
      shortName: 'Bộ đội Biên phòng',
      type: 'commemoration',
      isOff: false,
      icon: '🛡️',
      meaning: 'Kỷ niệm thành lập Công an Nhân dân Vũ trang (1959); củng cố thế trận biên phòng an ninh nhân dân.',
      legalBasis: 'Điều 4 Luật Biên giới Quốc gia 2003'
    },
    {
      id: 'quoc-te-phu-nu',
      day: 8,
      month: 3,
      name: 'Ngày Quốc tế Phụ nữ',
      shortName: 'Quốc tế Phụ nữ',
      type: 'commemoration',
      isOff: false,
      icon: '💐',
      meaning: 'Tôn vinh phái đẹp và quyền bình đẳng giới toàn cầu; gắn liền với ký ức cuộc Khởi nghĩa Hai Bà Trưng.',
      legalBasis: 'Phong trào Phụ nữ Quốc tế'
    },
    {
      id: 'quoc-te-hanh-phuc',
      day: 20,
      month: 3,
      name: 'Ngày Quốc tế Hạnh phúc',
      shortName: 'Quốc tế Hạnh phúc',
      type: 'commemoration',
      isOff: false,
      icon: '😊',
      meaning: 'Hưởng ứng thông điệp Liên Hợp Quốc về xây dựng gia đình no ấm, tiến bộ, lan tỏa yêu thương và hạnh phúc.',
      legalBasis: 'Nghị quyết Đại hội đồng LHQ 2012'
    },
    {
      id: 'cong-tac-xa-hoi',
      day: 25,
      month: 3,
      name: 'Ngày Công tác Xã hội Việt Nam',
      shortName: 'Công tác Xã hội',
      type: 'commemoration',
      isOff: false,
      icon: '🤝',
      meaning: 'Tôn vinh cán bộ an sinh xã hội, đẩy mạnh hoạt động trợ giúp người yếu thế và phục hồi hòa nhập cộng đồng.',
      legalBasis: 'Quyết định 1791/QĐ-TTg năm 2016'
    },
    {
      id: 'thanh-lap-doan-tncs',
      day: 26,
      month: 3,
      name: 'Ngày Thành lập Đoàn TNCS Hồ Chí Minh',
      shortName: 'Thành lập Đoàn',
      type: 'commemoration',
      isOff: false,
      icon: '🔥',
      meaning: 'Kỷ niệm thành lập tổ chức thanh niên tiền thân (26/03/1931), thắp sáng khát vọng và lý tưởng tuổi trẻ.',
      legalBasis: 'Nghị quyết Đại hội Đoàn toàn quốc 1961'
    },
    {
      id: 'dan-quan-tu-ve',
      day: 28,
      month: 3,
      name: 'Ngày Dân quân Tự vệ',
      shortName: 'Dân quân Tự vệ',
      type: 'commemoration',
      isOff: false,
      icon: '🎖️',
      meaning: 'Kỷ niệm Sắc lệnh tổ chức Tự vệ cứu quốc năm 1935, lực lượng vũ trang quần chúng sẵn sàng bảo vệ quê hương.',
      legalBasis: 'Luật Dân quân Tự vệ 2019'
    },
    {
      id: 'van-hoa-cac-dan-toc',
      day: 19,
      month: 4,
      name: 'Ngày Văn hóa các Dân tộc Việt Nam',
      shortName: 'Văn hóa Dân tộc',
      type: 'commemoration',
      isOff: false,
      icon: '🎎',
      meaning: 'Bảo tồn, tôn vinh và phát huy bản sắc di sản văn hóa truyền thống tốt đẹp của 54 dân tộc anh em.',
      legalBasis: 'Quyết định 1668/QĐ-TTg năm 2008'
    },
    {
      id: 'sach-va-van-hoa-doc',
      day: 21,
      month: 4,
      name: 'Ngày Sách và Văn hóa Đọc Việt Nam',
      shortName: 'Sách & Văn hóa Đọc',
      type: 'commemoration',
      isOff: false,
      icon: '📖',
      meaning: 'Kỷ niệm ngày phát hành tác phẩm "Đường Kách mệnh" (1927), tôn vinh giá trị của sách và văn hóa đọc.',
      legalBasis: 'Quyết định 1862/QĐ-TTg năm 2021'
    },
    {
      id: 'giai-phong-mien-nam',
      day: 30,
      month: 4,
      name: 'Giải phóng miền Nam, Thống nhất đất nước',
      shortName: 'Giải phóng miền Nam',
      type: 'national',
      isOff: true,
      icon: '⭐',
      meaning: 'Đánh dấu sự toàn thắng của Chiến dịch Hồ Chí Minh năm 1975, giang sơn thu về một mối; nghỉ 01 ngày hưởng lương.',
      legalBasis: 'Điểm c Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'quoc-te-lao-dong',
      day: 1,
      month: 5,
      name: 'Ngày Quốc tế Lao động',
      shortName: 'Quốc tế Lao động',
      type: 'national',
      isOff: true,
      icon: '🚩',
      meaning: 'Ngày hội đoàn kết giai cấp công nhân và nhân dân lao động trên toàn thế giới; nghỉ 01 ngày hưởng lương.',
      legalBasis: 'Điểm d Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'chien-thang-dien-bien-phu',
      day: 7,
      month: 5,
      name: 'Ngày Chiến thắng Điện Biên Phủ',
      shortName: 'Chiến thắng Điện Biên Phủ',
      type: 'national',
      isOff: false,
      icon: '🏅',
      meaning: 'Chiến thắng lịch sử Điện Biên Phủ năm 1954 "lừng lẫy năm châu, chấn động địa cầu", chấm dứt ách đô hộ thực dân.',
      legalBasis: 'Điều 4 Nghị định 145/2013/NĐ-CP'
    },
    {
      id: 'an-ninh-kinh-te',
      day: 13,
      month: 5,
      name: 'Ngày Truyền thống An ninh Kinh tế',
      shortName: 'An ninh Kinh tế',
      type: 'commemoration',
      isOff: false,
      icon: '💼',
      meaning: 'Ngày truyền thống lực lượng An ninh Kinh tế thuộc Bộ Công an, bảo vệ các mục tiêu công trình trọng điểm.',
      legalBasis: 'Quyết định 65/QĐ-A11'
    },
    {
      id: 'thanh-lap-doi-tntp',
      day: 15,
      month: 5,
      name: 'Ngày Thành lập Đội TNTP Hồ Chí Minh',
      shortName: 'Thành lập Đội',
      type: 'commemoration',
      isOff: false,
      icon: '🧣',
      meaning: 'Thành lập Hội Nhi đồng Cứu quốc tại Cao Bằng ngày 15/05/1941 với sự lãnh đạo của người anh hùng Kim Đồng.',
      legalBasis: 'Lịch sử Đội TNTP Hồ Chí Minh'
    },
    {
      id: 'khoa-hoc-cong-nghe',
      day: 18,
      month: 5,
      name: 'Ngày Khoa học và Công nghệ Việt Nam',
      shortName: 'Khoa học Công nghệ',
      type: 'commemoration',
      isOff: false,
      icon: '🔬',
      meaning: 'Tôn vinh trí thức và các nhà khoa học; động viên phong trào nghiên cứu, đổi mới sáng tạo phụng sự Tổ quốc.',
      legalBasis: 'Điều 7 Luật Khoa học & Công nghệ'
    },
    {
      id: 'sinh-nhat-bac-ho',
      day: 19,
      month: 5,
      name: 'Ngày sinh Chủ tịch Hồ Chí Minh',
      shortName: 'Sinh nhật Bác Hồ',
      type: 'national',
      isOff: false,
      icon: '⭐',
      meaning: 'Kỷ niệm ngày sinh vị Lãnh tụ thiên tài của dân tộc, Anh hùng giải phóng dân tộc, Danh nhân văn hóa kiệt xuất (1890).',
      legalBasis: 'Điều 4 Nghị định 145/2013/NĐ-CP'
    },
    {
      id: 'quoc-te-thieu-nhi',
      day: 1,
      month: 6,
      name: 'Ngày Quốc tế Thiếu nhi',
      shortName: 'Quốc tế Thiếu nhi',
      type: 'commemoration',
      isOff: false,
      icon: '🎈',
      meaning: 'Ngày hội vì tương lai trẻ thơ, khởi động Tháng Hành động vì trẻ em trên toàn quốc.',
      legalBasis: 'Công ước Quốc tế về Quyền Trẻ em'
    },
    {
      id: 'nguoi-cao-tuoi',
      day: 6,
      month: 6,
      name: 'Ngày Người Cao tuổi Việt Nam',
      shortName: 'Người Cao tuổi VN',
      type: 'commemoration',
      isOff: false,
      icon: '👴',
      meaning: 'Kỷ niệm lời hiệu triệu "Kính cáo đồng bào" năm 1941 của Bác Hồ; phát huy phong trào "Tuổi cao - Gương sáng".',
      legalBasis: 'Điều 6 Luật Người cao tuổi'
    },
    {
      id: 'bao-chi-cach-mang',
      day: 21,
      month: 6,
      name: 'Ngày Báo chí Cách mạng Việt Nam',
      shortName: 'Báo chí Cách mạng',
      type: 'commemoration',
      isOff: false,
      icon: '📰',
      meaning: 'Báo "Thanh niên" do lãnh tụ Nguyễn Ái Quốc sáng lập xuất bản số đầu tiên ngày 21/06/1925.',
      legalBasis: 'Ban Bí thư Trung ương Đảng'
    },
    {
      id: 'gia-dinh-viet-nam',
      day: 28,
      month: 6,
      name: 'Ngày Gia đình Việt Nam',
      shortName: 'Gia đình Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '🏡',
      meaning: 'Tôn vinh các giá trị văn hóa gia đình tiến bộ, ấm no, hạnh phúc; bài trừ bạo lực gia đình.',
      legalBasis: 'Quyết định 72/2001/QĐ-TTg'
    },
    {
      id: 'bao-hiem-y-te',
      day: 1,
      month: 7,
      name: 'Ngày Bảo hiểm Y tế Việt Nam',
      shortName: 'Bảo hiểm Y tế',
      type: 'commemoration',
      isOff: false,
      icon: '🏥',
      meaning: 'Tuyên truyền trụ cột an sinh xã hội, nâng cao nhận thức chăm sóc sức khỏe toàn dân.',
      legalBasis: 'Quyết định 823/QĐ-TTg năm 2009'
    },
    {
      id: 'du-lich-viet-nam',
      day: 9,
      month: 7,
      name: 'Ngày Du lịch Việt Nam',
      shortName: 'Du lịch Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '✈️',
      meaning: 'Kỷ niệm thành lập Công ty Du lịch Việt Nam năm 1960; quảng bá danh lam thắng cảnh đất nước.',
      legalBasis: 'Nghị định 26-CP năm 1960'
    },
    {
      id: 'thanh-nien-xung-phong',
      day: 15,
      month: 7,
      name: 'Ngày Truyền thống TNXP Việt Nam',
      shortName: 'Truyền thống TNXP',
      type: 'commemoration',
      isOff: false,
      icon: '🎖️',
      meaning: 'Tri ân các thế hệ Thanh niên xung phong cống hiến quên mình vì độc lập, tự do của Tổ quốc.',
      legalBasis: 'Quyết định 382-TTg năm 1995'
    },
    {
      id: 'thuong-binh-liet-si',
      day: 27,
      month: 7,
      name: 'Ngày Thương binh - Liệt sĩ',
      shortName: 'Thương binh - Liệt sĩ',
      type: 'commemoration',
      isOff: false,
      icon: '🕯️',
      meaning: 'Đạo lý "Uống nước nhớ nguồn", thắp nến tri ân đời đời tưởng nhớ các anh hùng liệt sĩ, thương bệnh binh.',
      legalBasis: 'Chỉ thị Chủ tịch Hồ Chí Minh 1947'
    },
    {
      id: 'cong-doan-viet-nam',
      day: 28,
      month: 7,
      name: 'Ngày Thành lập Công đoàn Việt Nam',
      shortName: 'Công đoàn Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '⚙️',
      meaning: 'Kỷ niệm thành lập Tổng Công hội Đỏ Bắc Kỳ năm 1929, chăm lo và bảo vệ quyền lợi hợp pháp của người lao động.',
      legalBasis: 'Lịch sử Công đoàn Việt Nam'
    },
    {
      id: 'nan-nhan-da-cam',
      day: 10,
      month: 8,
      name: 'Ngày Vì Nạn nhân Chất độc Da cam',
      shortName: 'Nạn nhân Da cam',
      type: 'commemoration',
      isOff: false,
      icon: '🧡',
      meaning: 'Kỷ niệm ngày đầu thảm họa dioxin (10/08/1961); chung tay xoa dịu nỗi đau da cam và đấu tranh vì công lý.',
      legalBasis: 'Thủ tướng Chính phủ'
    },
    {
      id: 'cach-mang-thang-tam',
      day: 19,
      month: 8,
      name: 'Cách mạng Tháng Tám & Ngày Truyền thống CAND',
      shortName: 'Cách mạng Tháng 8',
      type: 'national',
      isOff: false,
      icon: '⭐',
      meaning: 'Thắng lợi lịch sử Tổng khởi nghĩa Tháng Tám 1945 và Ngày hội toàn dân bảo vệ an ninh Tổ quốc.',
      legalBasis: 'Điều 4 NĐ 145/2013 & Luật CAND'
    },
    {
      id: 'truyen-thong-van-phong',
      day: 28,
      month: 8,
      name: 'Ngày Truyền thống Ngành TT-TT & Khối Hành chính',
      shortName: 'Truyền thống Hành chính',
      type: 'commemoration',
      isOff: false,
      icon: '🏛️',
      meaning: 'Kỷ niệm ngày Tuyên cáo thành lập Chính phủ Lâm thời năm 1945; ngày truyền thống Văn phòng, Tư pháp, Tài chính, TT-TT.',
      legalBasis: 'Quyết định 258/QĐ-TTg & 828/QĐ-TTg'
    },
    {
      id: 'quoc-khanh-viet-nam',
      day: 2,
      month: 9,
      name: 'Quốc khánh Nước CHXHCN Việt Nam',
      shortName: 'Quốc khánh 2/9',
      type: 'national',
      isOff: true,
      icon: '⭐',
      meaning: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình năm 1945; nghỉ 02 ngày hưởng lương.',
      legalBasis: 'Điểm đ Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'mat-tran-to-quoc',
      day: 10,
      month: 9,
      name: 'Ngày Thành lập Mặt trận Tổ quốc Việt Nam',
      shortName: 'Mặt trận Tổ quốc',
      type: 'commemoration',
      isOff: false,
      icon: '🤝',
      meaning: 'Kỷ niệm Đại hội Mặt trận Dân tộc Thống nhất năm 1955, củng cố và phát huy khối đại đoàn kết toàn dân tộc.',
      legalBasis: 'Nghị quyết Đại hội MTTQ'
    },
    {
      id: 'khuyen-hoc-viet-nam',
      day: 2,
      month: 10,
      name: 'Ngày Khuyến học Việt Nam',
      shortName: 'Khuyến học Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '📚',
      meaning: 'Phát động tuần lễ học tập suốt đời, xây dựng gia đình hiếu học, dòng họ học tập, xã hội học tập.',
      legalBasis: 'Quyết định 122/QĐ-TTg năm 1996'
    },
    {
      id: 'giai-phong-thu-do',
      day: 10,
      month: 10,
      name: 'Ngày Giải phóng Thủ đô / Ngày Luật sư Việt Nam',
      shortName: 'Giải phóng Thủ đô',
      type: 'commemoration',
      isOff: false,
      icon: '🏙️',
      meaning: 'Kỷ niệm đoàn quân tiếp quản Thủ đô năm 1954; Ngày truyền thống Luật sư Việt Nam và Ngày Chuyển đổi số quốc gia.',
      legalBasis: 'Sắc lệnh 46/SL & Quyết định 505/QĐ-TTg'
    },
    {
      id: 'doanh-nhan-viet-nam',
      day: 13,
      month: 10,
      name: 'Ngày Doanh nhân Việt Nam',
      shortName: 'Doanh nhân Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '💼',
      meaning: 'Kỷ niệm bức thư Chủ tịch Hồ Chí Minh gửi giới công thương (1945), tôn vinh đội ngũ doanh nhân kiến quốc.',
      legalBasis: 'Quyết định 990/QĐ-TTg năm 2004'
    },
    {
      id: 'nong-dan-viet-nam',
      day: 14,
      month: 10,
      name: 'Ngày Thành lập Hội Nông dân Việt Nam',
      shortName: 'Nông dân Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '🌾',
      meaning: 'Kỷ niệm thành lập Tổng Nông hội Đỏ tại Hội nghị Trung ương Đảng tháng 10/1930, giai cấp rường cột nông thôn.',
      legalBasis: 'Hội nghị Trung ương Đảng 10/1930'
    },
    {
      id: 'hoi-lhtn-viet-nam',
      day: 15,
      month: 10,
      name: 'Ngày Truyền thống Hội LHTN Việt Nam',
      shortName: 'Truyền thống LHTN',
      type: 'commemoration',
      isOff: false,
      icon: '🏕️',
      meaning: 'Kỷ niệm Đại hội thành lập Liên đoàn Thanh niên Việt Nam năm 1956 với phong trào "Tôi yêu Tổ quốc tôi".',
      legalBasis: 'Đại hội Hội LHTN Việt Nam 1956'
    },
    {
      id: 'phu-nu-viet-nam',
      day: 20,
      month: 10,
      name: 'Ngày Phụ nữ Việt Nam',
      shortName: 'Phụ nữ Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '🌸',
      meaning: 'Kỷ niệm ngày thành lập Hội Phụ nữ Phản đế năm 1930 (tiền thân của Hội Liên hiệp Phụ nữ Việt Nam).',
      legalBasis: 'Ban Bí thư Trung ương Đảng'
    },
    {
      id: 'dieu-duong-viet-nam',
      day: 26,
      month: 10,
      name: 'Ngày Điều dưỡng Việt Nam',
      shortName: 'Điều dưỡng VN',
      type: 'commemoration',
      isOff: false,
      icon: '🩺',
      meaning: 'Tôn vinh đội ngũ điều dưỡng viên trong công tác chăm sóc, bảo vệ sức khỏe và phục hồi cho người bệnh.',
      legalBasis: 'Đại hội Hội Điều dưỡng VN 1990'
    },
    {
      id: 'phap-luat-viet-nam',
      day: 9,
      month: 11,
      name: 'Ngày Pháp luật Nước CHXHCN Việt Nam',
      shortName: 'Ngày Pháp luật',
      type: 'commemoration',
      isOff: false,
      icon: '⚖️',
      meaning: 'Kỷ niệm ngày Quốc hội ban hành bản Hiến pháp đầu tiên năm 1946; tôn vinh tinh thần thượng tôn pháp luật.',
      legalBasis: 'Luật Phổ biến, giáo dục pháp luật 2012'
    },
    {
      id: 'dai-doan-ket-toan-dan',
      day: 18,
      month: 11,
      name: 'Ngày Hội Đại đoàn kết Toàn dân tộc',
      shortName: 'Đại đoàn kết Dân tộc',
      type: 'commemoration',
      isOff: false,
      icon: '🎉',
      meaning: 'Kỷ niệm thành lập Hội Phản đế Đồng minh năm 1930; ngày hội thắt chặt tình làng nghĩa xóm tại các khu dân cư.',
      legalBasis: 'Chỉ thị Ban Thường vụ TW Đảng 1930'
    },
    {
      id: 'nha-giao-viet-nam',
      day: 20,
      month: 11,
      name: 'Ngày Nhà giáo Việt Nam',
      shortName: 'Nhà giáo Việt Nam',
      type: 'commemoration',
      isOff: false,
      icon: '💐',
      meaning: 'Truyền thống "Tôn sư trọng đạo"; thế hệ học trò bày tỏ lòng tri ân sâu sắc tới công lao dạy dỗ của các thầy cô giáo.',
      legalBasis: 'Quyết định 167-HĐBT năm 1982'
    },
    {
      id: 'di-san-van-hoa',
      day: 23,
      month: 11,
      name: 'Ngày Di sản Văn hóa & Ngày Chữ thập đỏ',
      shortName: 'Di sản & Chữ thập đỏ',
      type: 'commemoration',
      isOff: false,
      icon: '🏯',
      meaning: 'Bảo tồn di sản văn hóa vật thể, phi vật thể và lan tỏa các giá trị nhân đạo cao đẹp trong cộng đồng.',
      legalBasis: 'Sắc lệnh 65/SL & Quyết định 36/2005'
    },
    {
      id: 'cuu-chien-binh',
      day: 6,
      month: 12,
      name: 'Ngày Thành lập Hội Cựu chiến binh Việt Nam',
      shortName: 'Cựu chiến binh VN',
      type: 'commemoration',
      isOff: false,
      icon: '🎖️',
      meaning: 'Kỷ niệm thành lập Hội Cựu chiến binh Việt Nam năm 1989, phát huy phẩm chất "Bộ đội Cụ Hồ" trong thời kỳ mới.',
      legalBasis: 'Quyết định của Bộ Chính trị 1989'
    },
    {
      id: 'toan-quoc-khang-chien',
      day: 19,
      month: 12,
      name: 'Ngày Toàn quốc Kháng chiến',
      shortName: 'Toàn quốc Kháng chiến',
      type: 'commemoration',
      isOff: false,
      icon: '⚔️',
      meaning: 'Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc Kháng chiến đêm 19/12/1946: "Thà hy sinh tất cả chứ nhất định không chịu mất nước".',
      legalBasis: 'Sự kiện lịch sử năm 1946'
    },
    {
      id: 'quan-doi-nhan-dan',
      day: 22,
      month: 12,
      name: 'Ngày Thành lập QĐND & Quốc phòng Toàn dân',
      shortName: 'Quân đội Nhân dân',
      type: 'commemoration',
      isOff: false,
      icon: '⭐',
      meaning: 'Kỷ niệm thành lập Đội VN Tuyên truyền Giải phóng quân năm 1944; xây dựng thế trận quốc phòng toàn dân vững mạnh.',
      legalBasis: 'Luật Quốc phòng năm 2018'
    },
    {
      id: 'giang-sinh-noel',
      day: 25,
      month: 12,
      name: 'Lễ Giáng Sinh (Noel)',
      shortName: 'Giáng Sinh',
      type: 'traditional',
      isOff: false,
      icon: '🎄',
      meaning: 'Đại lễ kỷ niệm Chúa Giêsu Kitô giáng sinh; ngày hội văn hóa phổ biến hướng về tình yêu thương và bình an.',
      legalBasis: 'Lễ hội Tôn giáo & Văn hóa Quốc tế'
    }
  ];

  // ---------------------------------------------------------------------------
  // 2. Lunar Holidays (Lễ Tiết & Phong Tục Dân Gian Âm Lịch)
  // ---------------------------------------------------------------------------
  const LUNAR_HOLIDAYS = [
    {
      id: 'tet-tao-quan',
      day: 23,
      month: 12,
      name: 'Tết Táo Quân (Tiễn Ông Công, Ông Táo)',
      shortName: 'Ông Công Ông Táo',
      type: 'traditional',
      isOff: false,
      icon: '🐟',
      meaning: 'Tín ngưỡng thờ Thần Bếp; ngày Táo quân cưỡi cá chép chầu trời báo cáo việc thiện ác gia trần.',
      legalBasis: 'Phong tục cổ truyền'
    },
    {
      id: 'tet-tat-nien',
      isLastDayOfLunarYear: true, // Special flag for 29 or 30 tháng Chạp
      name: 'Lễ Tất Niên (Đón Giao Thừa)',
      shortName: 'Tất Niên',
      type: 'national',
      isOff: true,
      icon: '🎆',
      meaning: 'Bữa cơm đoàn viên gia tộc, cúng lễ trừ tịch tạ ơn tổ tiên và đón rước thời khắc Giao thừa thiêng liêng.',
      legalBasis: 'Phong tục cổ truyền & Dịp nghỉ Tết'
    },
    {
      id: 'tet-nguyen-dan-m1',
      day: 1,
      month: 1,
      name: 'Tết Nguyên Đán (Mùng 1 Tết)',
      shortName: 'Mùng 1 Tết',
      type: 'national',
      isOff: true,
      icon: '🧧',
      meaning: 'Thời khắc đầu năm mới, biểu tượng tối thượng của sự tái sinh, hiếu kính; xông đất, chúc tết và đi chùa cầu an.',
      legalBasis: 'Điểm b Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'tet-nguyen-dan-m2',
      day: 2,
      month: 1,
      name: 'Tết Nguyên Đán (Mùng 2 Tết)',
      shortName: 'Mùng 2 Tết',
      type: 'national',
      isOff: true,
      icon: '🧧',
      meaning: 'Mùng một tết Cha, mùng hai tết Mẹ; thăm hỏi mừng tuổi họ hàng người thân trong không khí ấm áp.',
      legalBasis: 'Điểm b Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'tet-nguyen-dan-m3',
      day: 3,
      month: 1,
      name: 'Tết Nguyên Đán (Mùng 3 Tết)',
      shortName: 'Mùng 3 Tết',
      type: 'national',
      isOff: true,
      icon: '🧧',
      meaning: 'Mùng ba tết Thầy; tri ân công đức thầy cô giáo dạy dỗ, sum họp bạn bè và du xuân đầu năm.',
      legalBasis: 'Điểm b Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'tet-nguyen-tieu',
      day: 15,
      month: 1,
      name: 'Tết Nguyên Tiêu (Rằm tháng Giêng)',
      shortName: 'Rằm tháng Giêng',
      type: 'traditional',
      isOff: false,
      icon: '🏮',
      meaning: 'Đêm trăng tròn đầu tiên của năm mới ("Lễ Phật quanh năm không bằng Rằm tháng Giêng"); Ngày Thơ Việt Nam.',
      legalBasis: 'Phong tục cổ truyền & Ngày Thơ VN'
    },
    {
      id: 'tet-han-thuc',
      day: 3,
      month: 3,
      name: 'Tết Hàn Thực (Bánh trôi, Bánh chay)',
      shortName: 'Tết Hàn Thực',
      type: 'traditional',
      isOff: false,
      icon: '🥣',
      meaning: 'Gia đình quây quần nặn và dâng cúng bánh trôi, bánh chay; tôn vinh phẩm chất thanh sạch của tiền nhân.',
      legalBasis: 'Phong tục cổ truyền'
    },
    {
      id: 'gio-to-hung-vuong',
      day: 10,
      month: 3,
      name: 'Giỗ Tổ Hùng Vương (Lễ hội Đền Hùng)',
      shortName: 'Giỗ Tổ Hùng Vương',
      type: 'national',
      isOff: true,
      icon: '🏛️',
      meaning: 'Đại lễ tri ân các Vua Hùng khai sơn lập quốc, biểu tượng cội nguồn "đồng bào" và đại đoàn kết; nghỉ 01 ngày hưởng lương.',
      legalBasis: 'Điểm e Khoản 1 Điều 112 BLLĐ 2019'
    },
    {
      id: 'dai-le-phat-dan',
      day: 15,
      month: 4,
      name: 'Đại lễ Phật Đản (Vesak)',
      shortName: 'Lễ Phật Đản',
      type: 'traditional',
      isOff: false,
      icon: '🪷',
      meaning: 'Kỷ niệm ngày Đức Thích Ca Mâu Ni đản sinh; nghi thức tắm Phật, thuyết giảng kinh pháp và làm việc thiện cứu tế.',
      legalBasis: 'Lễ hội Phật giáo cổ truyền'
    },
    {
      id: 'tet-doan-ngo',
      day: 5,
      month: 5,
      name: 'Tết Đoan Ngọ (Diệt Sâu Bọ)',
      shortName: 'Tết Đoan Ngọ',
      type: 'traditional',
      isOff: false,
      icon: '🍃',
      meaning: 'Thời điểm cực dương, nghi lễ xua đuổi sâu bệnh hại mùa màng và bảo vệ sức khỏe (ăn cơm rượu nếp, quả chua).',
      legalBasis: 'Phong tục cổ truyền'
    },
    {
      id: 'le-that-tich',
      day: 7,
      month: 7,
      name: 'Lễ Thất Tịch (Ngưu Lang - Chức Nữ)',
      shortName: 'Lễ Thất Tịch',
      type: 'traditional',
      isOff: false,
      icon: '🎋',
      meaning: 'Truyền thuyết Ngưu Lang - Chức Nữ hội ngộ cầu Ô Thước; biểu trưng cho tình yêu thủy chung son sắt qua thử thách.',
      legalBasis: 'Phong tục dân gian'
    },
    {
      id: 'le-vu-lan',
      day: 15,
      month: 7,
      name: 'Lễ Vu Lan & Lễ Xá Tội Vong Nhân',
      shortName: 'Lễ Vu Lan',
      type: 'traditional',
      isOff: false,
      icon: '🌹',
      meaning: 'Triết lý hiếu đạo Mục Kiền Liên cứu mẹ (hoa hồng cài ngực) hòa quyện tín ngưỡng xá tội linh hồn phiêu bạt.',
      legalBasis: 'Phong tục Phật giáo & Dân gian'
    },
    {
      id: 'gio-to-san-khau',
      day: 12,
      month: 8,
      name: 'Ngày Sân Khấu Việt Nam (Giỗ Tổ Sân Khấu)',
      shortName: 'Giỗ Tổ Sân Khấu',
      type: 'commemoration',
      isOff: false,
      icon: '🎭',
      meaning: 'Tri ân các bậc Tiền hiền, Hậu hiền sáng lập và bồi đắp nghệ thuật sân khấu cổ truyền và đương đại.',
      legalBasis: 'Quyết định 13/QĐ-TTg năm 2011'
    },
    {
      id: 'tet-trung-thu',
      day: 15,
      month: 8,
      name: 'Tết Trung Thu (Tết Trông Trăng, Rằm Tháng 8)',
      shortName: 'Tết Trung Thu',
      type: 'traditional',
      isOff: false,
      icon: '🥮',
      meaning: 'Lễ tiết chính thu tạ ơn mùa màng, thưởng thức bánh nướng bánh dẻo, rước đèn ông sao, múa lân sư rồng.',
      legalBasis: 'Phong tục cổ truyền'
    },
    {
      id: 'tet-trung-cuu',
      day: 9,
      month: 9,
      name: 'Tết Trùng Cửu (Tết Trùng Dương)',
      shortName: 'Tết Trùng Cửu',
      type: 'traditional',
      isOff: false,
      icon: '🌼',
      meaning: 'Trùng phùng số cửu trường thọ; leo núi cao, ngắm hoa cúc, uống trà cúc, đàm đạo văn thơ và dưỡng sinh.',
      legalBasis: 'Phong tục Á Đông cổ truyền'
    },
    {
      id: 'tet-trung-thap',
      day: 10,
      month: 10,
      name: 'Tết Trùng Thập (Tết Cơm Mới, Tết Thầy Thuốc)',
      shortName: 'Tết Trùng Thập',
      type: 'traditional',
      isOff: false,
      icon: '🌾',
      meaning: 'Tạ ơn Thần Nông mùa màng tươi tốt sau vụ gặt lúa mùa; tôn vinh các bậc danh y của nền y học cổ truyền.',
      legalBasis: 'Phong tục nông nghiệp & Y học cổ truyền'
    },
    {
      id: 'tet-ha-nguyen',
      day: 15,
      month: 10,
      name: 'Tết Hạ Nguyên (Lễ Cúng Cơm Mới, Tạ Ơn)',
      shortName: 'Tết Hạ Nguyên',
      type: 'traditional',
      isOff: false,
      icon: '🍚',
      meaning: 'Kỳ rằm cuối cùng trong chu kỳ Tam Nguyên; cúng tạ ơn chư thiên thần linh phù hộ cho gia đạo yên lành.',
      legalBasis: 'Phong tục cổ truyền'
    }
  ];

  /**
   * Helper to check if a lunar date is the last day of the lunar year (29 or 30 tháng Chạp)
   */
  function isLastDayOfLunarYear(lunarDay, lunarMonth, solarDay, solarMonth, solarYear, vnlunar) {
    if (lunarMonth !== 12) return false;
    if (lunarDay === 30) return true;
    if (lunarDay === 29) {
      if (vnlunar && typeof vnlunar.convertSolar2Lunar === 'function') {
        const nextDate = new Date(solarYear, solarMonth - 1, solarDay + 1);
        const nextLunar = vnlunar.convertSolar2Lunar(nextDate.getDate(), nextDate.getMonth() + 1, nextDate.getFullYear());
        return nextLunar.month === 1 && nextLunar.day === 1;
      }
    }
    return false;
  }

  /**
   * Retrieves all matching Vietnamese holidays for a given solar and lunar date
   *
   * @param {number} solarDay 1-31
   * @param {number} solarMonth 1-12
   * @param {number} solarYear 4-digit
   * @param {number} lunarDay 1-30
   * @param {number} lunarMonth 1-12
   * @param {number} [lunarYear]
   * @param {boolean} [isLeap]
   * @param {object} [vnlunar] VNLunar instance for next-day lookups
   * @returns {Array<object>} List of matching holidays
   */
  function getHolidays(solarDay, solarMonth, solarYear, lunarDay, lunarMonth, lunarYear, isLeap = false, vnlunar = null) {
    const results = [];

    const sDay = Number(solarDay);
    const sMonth = Number(solarMonth);
    const lDay = Number(lunarDay);
    const lMonth = Number(lunarMonth);

    // 1. Check Solar Holidays
    for (const h of SOLAR_HOLIDAYS) {
      if (h.day === sDay && h.month === sMonth) {
        results.push({
          ...h,
          calendarType: 'solar'
        });
      }
    }

    // 2. Check Lunar Holidays (Normally traditional festivals only apply to non-leap months)
    if (!isLeap) {
      for (const h of LUNAR_HOLIDAYS) {
        if (h.isLastDayOfLunarYear) {
          if (isLastDayOfLunarYear(lDay, lMonth, sDay, sMonth, solarYear, vnlunar)) {
            results.push({
              ...h,
              calendarType: 'lunar'
            });
          }
        } else if (h.day === lDay && h.month === lMonth) {
          results.push({
            ...h,
            calendarType: 'lunar'
          });
        }
      }
    }

    return results;
  }

  return {
    SOLAR_HOLIDAYS,
    LUNAR_HOLIDAYS,
    getHolidays
  };
});
