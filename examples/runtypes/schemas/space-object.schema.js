/**
 * Generated by @zefiros-software/therefore
 * eslint-disable
 */
"use strict";module.exports = validate10;module.exports.default = validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","oneOf":[{"$ref":"#/definitions/Asteroid"},{"$ref":"#/definitions/Planet"},{"$ref":"#/definitions/Ship"}],"definitions":{"Asteroid":{"type":"object","properties":{"type":{"const":"asteroid"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0}},"required":["type","location","mass"],"additionalProperties":false},"VectorLocal":{"type":"array","title":"vector","items":[{"type":"number"},{"type":"number"},{"type":"number"}],"additionalItems":false,"minItems":3},"Planet":{"type":"object","properties":{"type":{"const":"planet"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0},"population":{"type":"number","minimum":0},"habitable":{"type":"boolean"}},"required":["type","location","mass","population","habitable"],"additionalProperties":false},"Ship":{"type":"object","properties":{"type":{"const":"ship"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0},"name":{"type":"string"},"crew":{"type":"array","items":{"$ref":"#/definitions/CrewMember"}}},"required":["type","location","mass","name","crew"],"additionalProperties":false},"CrewMember":{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"number","minimum":0},"rank":{"$ref":"#/definitions/Rank"},"home":{"$ref":"#/definitions/Planet"}},"required":["name","age","rank","home"],"additionalProperties":false},"Rank":{"enum":["captain","first mate","officer","ensign"]}}};const schema12 = {"type":"object","properties":{"type":{"const":"asteroid"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0}},"required":["type","location","mass"],"additionalProperties":false};const schema13 = {"type":"array","title":"vector","items":[{"type":"number"},{"type":"number"},{"type":"number"}],"additionalItems":false,"minItems":3};function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((data.type === undefined) && (missing0 = "type")) || ((data.location === undefined) && (missing0 = "location"))) || ((data.mass === undefined) && (missing0 = "mass"))){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!(((key0 === "type") || (key0 === "location")) || (key0 === "mass"))){delete data[key0];}}if(_errs1 === errors){if(data.type !== undefined){const _errs2 = errors;if("asteroid" !== data.type){validate11.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "asteroid"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.location !== undefined){let data1 = data.location;const _errs3 = errors;const _errs4 = errors;if(errors === _errs4){if(Array.isArray(data1)){if(data1.length < 3){validate11.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"}];return false;}else {const len0 = data1.length;if(!(len0 <= 3)){validate11.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/additionalItems",keyword:"additionalItems",params:{limit: 3},message:"must NOT have more than 3 items"}];return false;}else {const len1 = data1.length;if(len1 > 0){let data2 = data1[0];const _errs6 = errors;if(!((typeof data2 == "number") && (isFinite(data2)))){validate11.errors = [{instancePath:instancePath+"/location/0",schemaPath:"#/definitions/VectorLocal/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs6 === errors;}if(valid2){if(len1 > 1){let data3 = data1[1];const _errs8 = errors;if(!((typeof data3 == "number") && (isFinite(data3)))){validate11.errors = [{instancePath:instancePath+"/location/1",schemaPath:"#/definitions/VectorLocal/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs8 === errors;}if(valid2){if(len1 > 2){let data4 = data1[2];const _errs10 = errors;if(!((typeof data4 == "number") && (isFinite(data4)))){validate11.errors = [{instancePath:instancePath+"/location/2",schemaPath:"#/definitions/VectorLocal/items/2/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs10 === errors;}}}}}}else {validate11.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs3 === errors;}else {var valid0 = true;}if(valid0){if(data.mass !== undefined){let data5 = data.mass;const _errs12 = errors;if(errors === _errs12){if((typeof data5 == "number") && (isFinite(data5))){if(data5 < 0 || isNaN(data5)){validate11.errors = [{instancePath:instancePath+"/mass",schemaPath:"#/properties/mass/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];return false;}}else {validate11.errors = [{instancePath:instancePath+"/mass",schemaPath:"#/properties/mass/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}}var valid0 = _errs12 === errors;}else {var valid0 = true;}}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}const schema14 = {"type":"object","properties":{"type":{"const":"planet"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0},"population":{"type":"number","minimum":0},"habitable":{"type":"boolean"}},"required":["type","location","mass","population","habitable"],"additionalProperties":false};function validate13(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((((data.type === undefined) && (missing0 = "type")) || ((data.location === undefined) && (missing0 = "location"))) || ((data.mass === undefined) && (missing0 = "mass"))) || ((data.population === undefined) && (missing0 = "population"))) || ((data.habitable === undefined) && (missing0 = "habitable"))){validate13.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!(((((key0 === "type") || (key0 === "location")) || (key0 === "mass")) || (key0 === "population")) || (key0 === "habitable"))){delete data[key0];}}if(_errs1 === errors){if(data.type !== undefined){const _errs2 = errors;if("planet" !== data.type){validate13.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "planet"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.location !== undefined){let data1 = data.location;const _errs3 = errors;const _errs4 = errors;if(errors === _errs4){if(Array.isArray(data1)){if(data1.length < 3){validate13.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"}];return false;}else {const len0 = data1.length;if(!(len0 <= 3)){validate13.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/additionalItems",keyword:"additionalItems",params:{limit: 3},message:"must NOT have more than 3 items"}];return false;}else {const len1 = data1.length;if(len1 > 0){let data2 = data1[0];const _errs6 = errors;if(!((typeof data2 == "number") && (isFinite(data2)))){validate13.errors = [{instancePath:instancePath+"/location/0",schemaPath:"#/definitions/VectorLocal/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs6 === errors;}if(valid2){if(len1 > 1){let data3 = data1[1];const _errs8 = errors;if(!((typeof data3 == "number") && (isFinite(data3)))){validate13.errors = [{instancePath:instancePath+"/location/1",schemaPath:"#/definitions/VectorLocal/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs8 === errors;}if(valid2){if(len1 > 2){let data4 = data1[2];const _errs10 = errors;if(!((typeof data4 == "number") && (isFinite(data4)))){validate13.errors = [{instancePath:instancePath+"/location/2",schemaPath:"#/definitions/VectorLocal/items/2/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs10 === errors;}}}}}}else {validate13.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs3 === errors;}else {var valid0 = true;}if(valid0){if(data.mass !== undefined){let data5 = data.mass;const _errs12 = errors;if(errors === _errs12){if((typeof data5 == "number") && (isFinite(data5))){if(data5 < 0 || isNaN(data5)){validate13.errors = [{instancePath:instancePath+"/mass",schemaPath:"#/properties/mass/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];return false;}}else {validate13.errors = [{instancePath:instancePath+"/mass",schemaPath:"#/properties/mass/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}}var valid0 = _errs12 === errors;}else {var valid0 = true;}if(valid0){if(data.population !== undefined){let data6 = data.population;const _errs14 = errors;if(errors === _errs14){if((typeof data6 == "number") && (isFinite(data6))){if(data6 < 0 || isNaN(data6)){validate13.errors = [{instancePath:instancePath+"/population",schemaPath:"#/properties/population/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];return false;}}else {validate13.errors = [{instancePath:instancePath+"/population",schemaPath:"#/properties/population/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}}var valid0 = _errs14 === errors;}else {var valid0 = true;}if(valid0){if(data.habitable !== undefined){const _errs16 = errors;if(typeof data.habitable !== "boolean"){validate13.errors = [{instancePath:instancePath+"/habitable",schemaPath:"#/properties/habitable/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];return false;}var valid0 = _errs16 === errors;}else {var valid0 = true;}}}}}}}}else {validate13.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate13.errors = vErrors;return errors === 0;}const schema16 = {"type":"object","properties":{"type":{"const":"ship"},"location":{"$ref":"#/definitions/VectorLocal"},"mass":{"type":"number","minimum":0},"name":{"type":"string"},"crew":{"type":"array","items":{"$ref":"#/definitions/CrewMember"}}},"required":["type","location","mass","name","crew"],"additionalProperties":false};const schema18 = {"type":"object","properties":{"name":{"type":"string"},"age":{"type":"number","minimum":0},"rank":{"$ref":"#/definitions/Rank"},"home":{"$ref":"#/definitions/Planet"}},"required":["name","age","rank","home"],"additionalProperties":false};const schema19 = {"enum":["captain","first mate","officer","ensign"]};function validate16(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((((data.name === undefined) && (missing0 = "name")) || ((data.age === undefined) && (missing0 = "age"))) || ((data.rank === undefined) && (missing0 = "rank"))) || ((data.home === undefined) && (missing0 = "home"))){validate16.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((((key0 === "name") || (key0 === "age")) || (key0 === "rank")) || (key0 === "home"))){delete data[key0];}}if(_errs1 === errors){if(data.name !== undefined){const _errs2 = errors;if(typeof data.name !== "string"){validate16.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.age !== undefined){let data1 = data.age;const _errs4 = errors;if(errors === _errs4){if((typeof data1 == "number") && (isFinite(data1))){if(data1 < 0 || isNaN(data1)){validate16.errors = [{instancePath:instancePath+"/age",schemaPath:"#/properties/age/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];return false;}}else {validate16.errors = [{instancePath:instancePath+"/age",schemaPath:"#/properties/age/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.rank !== undefined){let data2 = data.rank;const _errs6 = errors;if(!((((data2 === "captain") || (data2 === "first mate")) || (data2 === "officer")) || (data2 === "ensign"))){validate16.errors = [{instancePath:instancePath+"/rank",schemaPath:"#/definitions/Rank/enum",keyword:"enum",params:{allowedValues: schema19.enum},message:"must be equal to one of the allowed values"}];return false;}var valid0 = _errs6 === errors;}else {var valid0 = true;}if(valid0){if(data.home !== undefined){const _errs8 = errors;if(!(validate13(data.home, {instancePath:instancePath+"/home",parentData:data,parentDataProperty:"home",rootData}))){vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);errors = vErrors.length;}var valid0 = _errs8 === errors;}else {var valid0 = true;}}}}}}}else {validate16.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate16.errors = vErrors;return errors === 0;}function validate15(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((((data.type === undefined) && (missing0 = "type")) || ((data.location === undefined) && (missing0 = "location"))) || ((data.mass === undefined) && (missing0 = "mass"))) || ((data.name === undefined) && (missing0 = "name"))) || ((data.crew === undefined) && (missing0 = "crew"))){validate15.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!(((((key0 === "type") || (key0 === "location")) || (key0 === "mass")) || (key0 === "name")) || (key0 === "crew"))){delete data[key0];}}if(_errs1 === errors){if(data.type !== undefined){const _errs2 = errors;if("ship" !== data.type){validate15.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "ship"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.location !== undefined){let data1 = data.location;const _errs3 = errors;const _errs4 = errors;if(errors === _errs4){if(Array.isArray(data1)){if(data1.length < 3){validate15.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"}];return false;}else {const len0 = data1.length;if(!(len0 <= 3)){validate15.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/additionalItems",keyword:"additionalItems",params:{limit: 3},message:"must NOT have more than 3 items"}];return false;}else {const len1 = data1.length;if(len1 > 0){let data2 = data1[0];const _errs6 = errors;if(!((typeof data2 == "number") && (isFinite(data2)))){validate15.errors = [{instancePath:instancePath+"/location/0",schemaPath:"#/definitions/VectorLocal/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs6 === errors;}if(valid2){if(len1 > 1){let data3 = data1[1];const _errs8 = errors;if(!((typeof data3 == "number") && (isFinite(data3)))){validate15.errors = [{instancePath:instancePath+"/location/1",schemaPath:"#/definitions/VectorLocal/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs8 === errors;}if(valid2){if(len1 > 2){let data4 = data1[2];const _errs10 = errors;if(!((typeof data4 == "number") && (isFinite(data4)))){validate15.errors = [{instancePath:instancePath+"/location/2",schemaPath:"#/definitions/VectorLocal/items/2/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid2 = _errs10 === errors;}}}}}}else {validate15.errors = [{instancePath:instancePath+"/location",schemaPath:"#/definitions/VectorLocal/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs3 === errors;}else {var valid0 = true;}if(valid0){if(data.mass !== undefined){let data5 = data.mass;const _errs12 = errors;if(errors === _errs12){if((typeof data5 == "number") && (isFinite(data5))){if(data5 < 0 || isNaN(data5)){validate15.errors = [{instancePath:instancePath+"/mass",schemaPath:"#/properties/mass/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];return false;}}else {validate15.errors = [{instancePath:instancePath+"/mass",schemaPath:"#/properties/mass/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}}var valid0 = _errs12 === errors;}else {var valid0 = true;}if(valid0){if(data.name !== undefined){const _errs14 = errors;if(typeof data.name !== "string"){validate15.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs14 === errors;}else {var valid0 = true;}if(valid0){if(data.crew !== undefined){let data7 = data.crew;const _errs16 = errors;if(errors === _errs16){if(Array.isArray(data7)){var valid3 = true;const len2 = data7.length;for(let i0=0; i0<len2; i0++){const _errs18 = errors;if(!(validate16(data7[i0], {instancePath:instancePath+"/crew/" + i0,parentData:data7,parentDataProperty:i0,rootData}))){vErrors = vErrors === null ? validate16.errors : vErrors.concat(validate16.errors);errors = vErrors.length;}var valid3 = _errs18 === errors;if(!valid3){break;}}}else {validate15.errors = [{instancePath:instancePath+"/crew",schemaPath:"#/properties/crew/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs16 === errors;}else {var valid0 = true;}}}}}}}}else {validate15.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate15.errors = vErrors;return errors === 0;}function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;const _errs0 = errors;let valid0 = false;let passing0 = null;const _errs1 = errors;if(!(validate11(data, {instancePath,parentData,parentDataProperty,rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var _valid0 = _errs1 === errors;if(_valid0){valid0 = true;passing0 = 0;}const _errs2 = errors;if(!(validate13(data, {instancePath,parentData,parentDataProperty,rootData}))){vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);errors = vErrors.length;}var _valid0 = _errs2 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 1];}else {if(_valid0){valid0 = true;passing0 = 1;}const _errs3 = errors;if(!(validate15(data, {instancePath,parentData,parentDataProperty,rootData}))){vErrors = vErrors === null ? validate15.errors : vErrors.concat(validate15.errors);errors = vErrors.length;}var _valid0 = _errs3 === errors;if(_valid0 && valid0){valid0 = false;passing0 = [passing0, 2];}else {if(_valid0){valid0 = true;passing0 = 2;}}}if(!valid0){const err0 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;validate10.errors = vErrors;return false;}else {errors = _errs0;if(vErrors !== null){if(_errs0){vErrors.length = _errs0;}else {vErrors = null;}}}validate10.errors = vErrors;return errors === 0;}