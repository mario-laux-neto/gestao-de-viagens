const Joi = require('joi');

const criar = Joi.object({
  nome: Joi.string().max(100).required()
    .messages({ 'any.required': 'Nome do roteiro é obrigatório' }),
  destino_id: Joi.number().integer().required()
    .messages({ 'any.required': 'Destino é obrigatório' }),
  data_ida: Joi.date().required()
    .messages({ 'any.required': 'Data de ida é obrigatória' }),
  data_volta: Joi.date().min(Joi.ref('data_ida')).required()
    .messages({
      'any.required': 'Data de volta é obrigatória',
      'date.min': 'Data de volta deve ser igual ou posterior à data de ida'
    }),
  status: Joi.string().valid('rascunho', 'planejando', 'confirmado', 'concluido').default('rascunho')
    .messages({ 'any.only': 'Status inválido' })
});

const atualizar = Joi.object({
  nome: Joi.string().max(100),
  destino_id: Joi.number().integer(),
  data_ida: Joi.date(),
  data_volta: Joi.date(),
  status: Joi.string().valid('rascunho', 'planejando', 'confirmado', 'concluido')
}).min(1).messages({ 'object.min': 'Informe ao menos um campo para atualizar' });

module.exports = { criar, atualizar };
