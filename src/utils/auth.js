import {BASE_URL} from "./utils";

/** Объект с ошибками сервера
 * @type {{"400": string, "401": string}}
 */
const SERVER_ERRORS = {
    400: "Одно из полей не заполнено или не прошло валидацию.",
    401: "Пользователь с введенным email не найден."
}

/** Хандл проверки ответа при регистрации, возвращает ответ или ошибку
 * @param res - ответ
 * @returns {*}
 */
const handleRegResponse = (res) => {
    if (res.status !== 400) {
        return res.json();
    } else {
        throw new Error(SERVER_ERRORS[res.status]);
    }
}

/** Хандл проверки ответа при авторизации, возвращает ответ или ошибку
 * @param res - ответ
 * @returns {*}
 */
const handleAuthResponse = (res) => {
    if (res.status === 400 || res.status === 401) {
        throw new Error(SERVER_ERRORS[res.status]);
    } else {
        return res.json();
    }
}

/** Отправка рег. данных
 * @param registerData - рег. данные {email: string, password: string}
 * @returns {Promise<Response>}
 */
export const register = (registerData) => {
    return fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
    })
        .then((res) => handleRegResponse(res))
}

/** Отправка данных входа
 * @param loginData - данные входа {email: string, password: string}
 * @returns {Promise<Response>}
 */
export const authorize = (loginData) => {
    return fetch(`${BASE_URL}/signin`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then((res) => handleAuthResponse(res))
}

/** Получает email по токену, проверка валидности токена
 * @param token - jwt-токен
 * @returns {Promise<any>}
 */
export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    })
        .then((res) => handleRegResponse(res))
}