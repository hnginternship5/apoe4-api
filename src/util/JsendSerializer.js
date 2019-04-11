export default class JsendSerializer {
    static success(message, data, code) {
        return {
            status: 'success',
            message,
            code: code || 200,
            data
        }
    }

    static fail(message, data, code) {
        return {
            status: 'fail',
            message,
            code,
            data
        }
    }

    static error(message, code) {
        return {
            status: 'error',
            message,
            code,
            data: null
        }
    }
}