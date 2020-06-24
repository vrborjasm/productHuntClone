export default function newAccountValidation(values) {

    let error = {};

    if(!values.name) {
        error.name = "El nombre es obligatorio";
    }

    if(!values.email) {
        error.email = "El email es obligatorio";
    } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        error.email = "Email no valido";
    }

    if(!values.password) {
        error.password = "El password es obligatorio";
    } else if (values.password.length < 6) {
        error.password = "El password debe tener al menos 6 caracteres";
    }

    return error;
} 