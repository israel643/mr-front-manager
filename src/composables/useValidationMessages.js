export function getValidationError(field, messages = {}) {
    if (!field?.$dirty || !field?.$error) return '';

    for (const rule in messages)
        if (field?.[rule]?.$invalid) return messages[rule];

    return 'Campo inválido';
}