const hardwareSchema = {
    type: 'object',
    properties: {
      Hardware: {
        type: 'string',
      },
      ConstraintType:{
        type:'string'
      },
      TestValue:{
        type:'string'
      },
      Operator:{
        type:'string'
      }
    },
  };
  
module.exports = hardwareSchema;