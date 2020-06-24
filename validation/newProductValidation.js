export default function newProductValidation(values) {

    let error = {};

    if(!values.name) {
        error.name = "El nombre es obligatorio";
    }

    if(!values.business) {
        error.business = "El nombre de la empresa es obligatorio";
    }

    if(!values.url) {
        error.url = "La url es obligatorio";
    } else if ( !/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        error.url = "URL no valido";
    }

    if(!values.description) {
        error.description = "Una descripcion del producto es obligatoria";
    }

    return error;
} 