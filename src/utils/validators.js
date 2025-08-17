// validators.js
// ✅ Funções de validação do app Sorteio Já
// Valida dados de entrada e validações de negócio

import { APP_CONFIG } from './constants';

/**
 * ✅ Validar nome da lista
 */
export const validateListName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Nome da lista é obrigatório' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Nome da lista não pode estar vazio' };
  }
  
  if (trimmedName.length > APP_CONFIG.MAX_LIST_NAME_LENGTH) {
    return { 
      isValid: false, 
      error: `Nome da lista deve ter no máximo ${APP_CONFIG.MAX_LIST_NAME_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar nome do participante
 */
export const validateParticipantName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Nome do participante é obrigatório' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Nome do participante não pode estar vazio' };
  }
  
  if (trimmedName.length > APP_CONFIG.MAX_PARTICIPANT_NAME_LENGTH) {
    return { 
      isValid: false, 
      error: `Nome do participante deve ter no máximo ${APP_CONFIG.MAX_PARTICIPANT_NAME_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar lista de participantes
 */
export const validateParticipantsList = (participants) => {
  if (!Array.isArray(participants)) {
    return { isValid: false, error: 'Lista de participantes deve ser um array' };
  }
  
  if (participants.length === 0) {
    return { isValid: false, error: 'Lista deve ter pelo menos um participante' };
  }
  
  if (participants.length > APP_CONFIG.MAX_PARTICIPANTS_PER_LIST) {
    return { 
      isValid: false, 
      error: `Lista deve ter no máximo ${APP_CONFIG.MAX_PARTICIPANTS_PER_LIST} participantes` 
    };
  }
  
  // Validar cada participante
  for (let i = 0; i < participants.length; i++) {
    const participant = participants[i];
    const validation = validateParticipantName(participant);
    
    if (!validation.isValid) {
      return { 
        isValid: false, 
        error: `Participante ${i + 1}: ${validation.error}` 
      };
    }
  }
  
  // Verificar duplicatas
  const uniqueNames = new Set(participants.map(p => p.trim().toLowerCase()));
  if (uniqueNames.size !== participants.length) {
    return { isValid: false, error: 'Não são permitidos nomes duplicados' };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar hash
 */
export const validateHash = (hash) => {
  if (!hash || typeof hash !== 'string') {
    return { isValid: false, error: 'Hash é obrigatório' };
  }
  
  if (hash.length < APP_CONFIG.MIN_HASH_LENGTH) {
    return { 
      isValid: false, 
      error: `Hash deve ter pelo menos ${APP_CONFIG.MIN_HASH_LENGTH} caracteres` 
    };
  }
  
  // Verificar se contém apenas caracteres hexadecimais
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(hash)) {
    return { isValid: false, error: 'Hash deve conter apenas caracteres hexadecimais' };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email não pode estar vazio' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar número de telefone
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Telefone é obrigatório' };
  }
  
  const cleanedPhone = phone.replace(/\D/g, '');
  
  if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
    return { isValid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar CPF
 */
export const validateCPF = (cpf) => {
  if (!cpf || typeof cpf !== 'string') {
    return { isValid: false, error: 'CPF é obrigatório' };
  }
  
  const cleanedCPF = cpf.replace(/\D/g, '');
  
  if (cleanedCPF.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanedCPF)) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
  }
  
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  
  if (remainder !== parseInt(cleanedCPF.charAt(9))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
  }
  
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  
  if (remainder !== parseInt(cleanedCPF.charAt(10))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar data
 */
export const validateDate = (date) => {
  if (!date) {
    return { isValid: false, error: 'Data é obrigatória' };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }
  
  const now = new Date();
  if (dateObj > now) {
    return { isValid: false, error: 'Data não pode ser no futuro' };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar número
 */
export const validateNumber = (number, options = {}) => {
  const { min, max, required = true, integer = false } = options;
  
  if (required && (number === null || number === undefined || number === '')) {
    return { isValid: false, error: 'Número é obrigatório' };
  }
  
  if (!required && (number === null || number === undefined || number === '')) {
    return { isValid: true, error: null };
  }
  
  const num = Number(number);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Valor deve ser um número' };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: 'Número deve ser inteiro' };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `Número deve ser maior ou igual a ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `Número deve ser menor ou igual a ${max}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar string
 */
export const validateString = (str, options = {}) => {
  const { minLength, maxLength, required = true, pattern } = options;
  
  if (required && (str === null || str === undefined)) {
    return { isValid: false, error: 'Texto é obrigatório' };
  }
  
  if (!required && (str === null || str === undefined)) {
    return { isValid: true, error: null };
  }
  
  if (typeof str !== 'string') {
    return { isValid: false, error: 'Valor deve ser um texto' };
  }
  
  const trimmedStr = str.trim();
  
  if (required && trimmedStr.length === 0) {
    return { isValid: false, error: 'Texto não pode estar vazio' };
  }
  
  if (minLength !== undefined && trimmedStr.length < minLength) {
    return { isValid: false, error: `Texto deve ter pelo menos ${minLength} caracteres` };
  }
  
  if (maxLength !== undefined && trimmedStr.length > maxLength) {
    return { isValid: false, error: `Texto deve ter no máximo ${maxLength} caracteres` };
  }
  
  if (pattern && !pattern.test(trimmedStr)) {
    return { isValid: false, error: 'Formato de texto inválido' };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar array
 */
export const validateArray = (arr, options = {}) => {
  const { minLength, maxLength, required = true, itemValidator } = options;
  
  if (required && (arr === null || arr === undefined)) {
    return { isValid: false, error: 'Lista é obrigatória' };
  }
  
  if (!required && (arr === null || arr === undefined)) {
    return { isValid: true, error: null };
  }
  
  if (!Array.isArray(arr)) {
    return { isValid: false, error: 'Valor deve ser uma lista' };
  }
  
  if (minLength !== undefined && arr.length < minLength) {
    return { isValid: false, error: `Lista deve ter pelo menos ${minLength} itens` };
  }
  
  if (maxLength !== undefined && arr.length > maxLength) {
    return { isValid: false, error: `Lista deve ter no máximo ${maxLength} itens` };
  }
  
  if (itemValidator) {
    for (let i = 0; i < arr.length; i++) {
      const validation = itemValidator(arr[i], i);
      if (!validation.isValid) {
        return { 
          isValid: false, 
          error: `Item ${i + 1}: ${validation.error}` 
        };
      }
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar objeto
 */
export const validateObject = (obj, schema) => {
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, error: 'Objeto é obrigatório' };
  }
  
  const errors = [];
  
  for (const [key, validator] of Object.entries(schema)) {
    const value = obj[key];
    const validation = validator(value);
    
    if (!validation.isValid) {
      errors.push(`${key}: ${validation.error}`);
    }
  }
  
  if (errors.length > 0) {
    return { isValid: false, error: errors.join('; ') };
  }
  
  return { isValid: true, error: null };
};

/**
 * ✅ Validar formulário completo
 */
export const validateForm = (formData, validations) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, validator] of Object.entries(validations)) {
    const value = formData[field];
    const validation = validator(value);
    
    if (!validation.isValid) {
      errors[field] = validation.error;
      isValid = false;
    }
  }
  
  return { isValid, errors };
};

/**
 * ✅ Validar configurações do app
 */
export const validateAppSettings = (settings) => {
  const schema = {
    soundEnabled: (value) => validateString(value, { required: false }),
    hapticEnabled: (value) => validateString(value, { required: false }),
    notificationsEnabled: (value) => validateString(value, { required: false }),
    autoSaveEnabled: (value) => validateString(value, { required: false }),
    darkModeEnabled: (value) => validateString(value, { required: false }),
    language: (value) => validateString(value, { required: false }),
  };
  
  return validateObject(settings, schema);
};

/**
 * ✅ Validar dados de sorteio
 */
export const validateDrawData = (drawData) => {
  const schema = {
    listId: (value) => validateNumber(value, { required: true, integer: true, min: 1 }),
    algorithm: (value) => validateString(value, { required: true, minLength: 1 }),
    participants: (value) => validateArray(value, { required: true, minLength: 1 }),
    timestamp: (value) => validateDate(value),
  };
  
  return validateObject(drawData, schema);
};
