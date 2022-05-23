/** Объект настроек для работы с API
 * @type {{headers: {authorization: string, "Content-Type": string}, serverURL: string}}
 */
export const apiSettings = {
    serverURL: "https://mesto.nomoreparties.co/v1/cohort-39",
    headers: {
        authorization: "4731e034-9d67-4265-b193-d9b726ab32a8",
        "Content-Type": "application/json"
    }
};

/** Адрес сервера авторизации
 * @type {string}
 */
export const BASE_URL = "https://auth.nomoreparties.co";
