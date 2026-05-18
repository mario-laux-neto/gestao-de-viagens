const Joi = require('joi');

const criar = Joi.object({
  cidade: Joi.string().max(80).required()
    .messages({
      'any.required': 'Cidade é obrigatória',
      'string.max': 'Cidade deve ter no máximo 80 caracteres'
    }),
  pais: Joi.string().max(60).required()
    .messages({
      'any.required': 'País é obrigatório',
      'string.max': 'País deve ter no máximo 60 caracteres'
    }),
  descricao: Joi.string().allow('', null),
  custo_estimado: Joi.number().min(0).default(0)
    .messages({ 'number.min': 'Custo estimado não pode ser negativo' })
});

const atualizar = Joi.object({
  cidade: Joi.string().max(80),
  pais: Joi.string().max(60),
  descricao: Joi.string().allow('', null),
  custo_estimado: Joi.number().min(0)
}).min(1).messages({ 'object.min': 'Informe ao menos um campo para atualizar' });

module.exports = { criar, atualizar };
