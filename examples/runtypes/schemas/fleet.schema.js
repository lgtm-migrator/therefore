/**
 * Generated by @zefiros-software/therefore
 * eslint-disable
 */
"use strict";module.exports = validate10;module.exports.default = validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","additionalProperties":{"$ref":"#/definitions/Ship"},"definitions":{"Ship":{"type":"object","properties":{"type":{"const":"ship"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0},"name":{"type":"string"},"crew":{"type":"array","items":{"$ref":"#/definitions/CrewMember"}}},"required":["type","location","mass","name","crew"],"additionalProperties":false},"VectorLocal":{"type":"array","items":[{"type":"number"},{"type":"number"},{"type":"number"}],"additionalItems":false,"minItems":3},"CrewMember":{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"number","minimum":0},"rank":{"$ref":"#/definitions/Rank"},"home":{"$ref":"#/definitions/Planet"}},"required":["name","age","rank","home"],"additionalProperties":false},"Rank":{"enum":["captain","first mate","officer","ensign"]},"Planet":{"type":"object","properties":{"type":{"const":"planet"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0},"population":{"type":"number","minimum":0},"habitable":{"type":"boolean"}},"required":["type","location","mass","population","habitable"],"additionalProperties":false}}};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){for(const key0 in data){delete data[key0];}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;}