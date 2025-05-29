var Telegram = {
    token: null,
    to: null,
    topic: null,
    message: null,
    proxy: null,
    parse_mode: null,

    escapeMarkup: function (str, mode) {
        switch (mode) {
            case 'markdown':
                return str.replace(/([_*\[`])/g, '\\$&');
            case 'markdownv2':
                return str.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$&');
            case 'html':
                return str.replace(/<(\s|[^a-z\/])/g, '&lt;$1');
            default:
                return str;
        }
    },

    sendMessage: function () {
        var url = 'https://telegram-api.nexttech.workers.dev/bot' + Telegram.token + '/sendMessage';
        var params = {
            chat_id: Telegram.to,
            message_thread_id: Telegram.topic,
            text: Telegram.message,
            disable_web_page_preview: true,
            disable_notification: false
        };

        if (Telegram.parse_mode) {
            params.parse_mode = Telegram.parse_mode;
        }

        var request = new HttpRequest();
        request.addHeader('Content-Type: application/json');

        Zabbix.Log(4, '[Telegram Webhook] URL: ' + url.replace(Telegram.token, '<TOKEN>'));
        Zabbix.Log(4, '[Telegram Webhook] Payload: ' + JSON.stringify(params));

        var response = request.post(url, JSON.stringify(params));

        Zabbix.Log(4, '[Telegram Webhook] HTTP response: ' + response);

        try {
            response = JSON.parse(response);
        } catch (error) {
            throw 'Invalid JSON response';
        }

        if (!response.ok) {
            throw response.description || 'Unknown error';
        }
    }
};

try {
    var params = JSON.parse(value);

    if (!params.Token) throw 'Missing parameter "Token"';
    Telegram.token = params.Token;

    if (params.To) Telegram.to = params.To;
    if (params.Topic) Telegram.topic = params.Topic;

    Telegram.message = (params.Subject || '') + '\n' + (params.Message || '');

    if (['markdown', 'html', 'markdownv2'].indexOf(params.ParseMode) !== -1) {
        Telegram.parse_mode = params.ParseMode;
        Telegram.message = Telegram.escapeMarkup(Telegram.message, params.ParseMode);
    }

    Telegram.sendMessage();
    return 'OK';

} catch (error) {
    Zabbix.Log(4, '[Telegram Webhook] Error: ' + error);
    throw 'Sending failed: ' + error;
}
