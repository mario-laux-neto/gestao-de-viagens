const Joi = require('joi');

const criar = Joi.object({
  nome: Joi.string().max(120).required()
    .messages({ 'any.required': 'Nome da atividade é obrigatório' }),
  roteiro_id: Joi.number().integer().required()
    .messages({ 'any.required': 'Roteiro é obrigatório' }),
  local: Joi.string().max(150).allow('', null),
  horario: Joi.date().required()
    .messages({ 'any.required': 'Horário é obrigatório' }),
  custo: Joi.number().min(0).default(0)
    .messages({ 'number.min': 'Custo não pode ser negativo' }),
  feito: Joi.boolean().default(false)
});

const atualizar = Joi.object({
  nome: Joi.string().max(120),
  roteiro_id: Joi.number().integer(),
  local: Joi.string().max(150).allow('', null),
  horario: Joi.date(),
  custo: Joi.number().min(0),
  feito: Joi.boolean()
}).min(1).messages({ 'object.min': 'Informe ao menos um campo para atualizar' });

module.exports = { criar, atualizar };
