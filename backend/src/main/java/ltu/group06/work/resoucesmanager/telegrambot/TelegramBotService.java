package ltu.group06.work.resoucesmanager.telegrambot;

import ltu.group06.work.resoucesmanager.entity.OTP;
import ltu.group06.work.resoucesmanager.entity.User;
import ltu.group06.work.resoucesmanager.service.OtpService;
import ltu.group06.work.resoucesmanager.service.UserService;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TelegramBotService extends TelegramLongPollingBot {

    private final UserService userService;
    private final OtpService otpService;

    // Map để theo dõi trạng thái người dùng đang chờ nhập OTP
    private final ConcurrentHashMap<Long, OTP> awaitingOtpMap = new ConcurrentHashMap<>();

    // Map để theo dõi người dùng đang chờ nhập email
    private final ConcurrentHashMap<Long, Boolean> awaitingEmailMap = new ConcurrentHashMap<>();

    public TelegramBotService(UserService userService, OtpService otpService) {
        this.userService = userService;
        this.otpService = otpService;
    }

    @Override
    public String getBotUsername() {
        return "ResourcesManagerBot";
    }

    @Override
    public String getBotToken() {
        return "7888523580:AAFEH_VXRj4N4PYeuBEqe70hwRm60uSo9LU";
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            Long chatId = update.getMessage().getChatId();

            if (messageText.equalsIgnoreCase("/start")) {
                sendMessage(chatId, "Chào mừng bạn đến với ResourcesManagerBot! Nhập /help để xem các tùy chọn.");
            } else if (messageText.equalsIgnoreCase("/help")) {
                sendMessage(chatId, "/active - Kích hoạt tài khoản bằng email\n/help - Hiển thị các tùy chọn");
            } else if (messageText.equalsIgnoreCase("/active")) {
                sendMessage(chatId, "Vui lòng nhập email của bạn để kích hoạt.");
                awaitingEmailMap.put(chatId, true);
            } else if (awaitingEmailMap.getOrDefault(chatId, false)) {
                handleEmailInput(chatId, messageText);
            } else if (awaitingOtpMap.containsKey(chatId)) {
                handleOtpInput(chatId, messageText);
            } else {
                sendMessage(chatId, "Lệnh không hợp lệ. Nhập /help để xem các tùy chọn.");
            }
        }
    }

    private void handleEmailInput(Long chatId, String email) {
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Kiểm tra nếu Telegram ID đã được liên kết
            if (user.getTelegramId() != null && user.getTelegramId().equals(chatId)) {
                sendMessage(chatId, "Tài khoản của bạn đã được liên kết với bot Telegram.");
                awaitingEmailMap.remove(chatId);
                return;
            }

            OTP otp = otpService.sendOTP(user);  // Gửi OTP mới và lưu vào DB
            sendMessage(chatId, "OTP đã được gửi đến email của bạn. Vui lòng nhập OTP trong vòng 15 phút.");
            awaitingOtpMap.put(chatId, otp);
            awaitingEmailMap.remove(chatId);
        } else {
            sendMessage(chatId, "Email không tồn tại trong hệ thống. Vui lòng thử lại.");
        }
    }

    private void handleOtpInput(Long chatId, String messageText) {
        OTP otp = awaitingOtpMap.get(chatId);

        if (messageText.equalsIgnoreCase("yes")) {
            resendOtp(chatId, otp.getUser());
        } else if (messageText.equalsIgnoreCase("no")) {
            sendMessage(chatId, "Hãy thử nhập lại OTP cho đúng.");
        } else {
            if (otp.isExpired() || !otp.getOtpCode().equals(messageText)) {
                sendMessage(chatId, "OTP không hợp lệ hoặc đã hết hạn. Bạn có muốn gửi lại OTP không? (Trả lời 'yes' để gửi lại)");
            } else {
                activateUserAccount(chatId, otp.getUser());
            }
        }
    }

    private void resendOtp(Long chatId, User user) {
        // Vô hiệu hóa OTP cũ nếu user muốn gửi 1 OTP mới
        otpService.disableOldOtps(user);
        // OTP moi dc gui đi
        OTP newOtp = otpService.sendOTP(user);  // Gửi OTP mới
        sendMessage(chatId, "OTP mới đã được gửi đến email của bạn. Vui lòng nhập OTP mới.");
        // Cập nhật với OTP mới
        awaitingOtpMap.put(chatId, newOtp);
    }

    private void activateUserAccount(Long chatId, User user) {
        user.setTelegramId(chatId);
        user.setActivated(true);
        userService.save(user);
        sendMessage(chatId, "Kích hoạt thành công! Tài khoản của bạn đã được liên kết với bot Telegram.");
        awaitingOtpMap.remove(chatId);  // Xóa trạng thái chờ OTP
    }

    private void sendMessage(Long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());
        message.setText(text);
        try {
            execute(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
