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
      },
      Reports:{
        type:'array'
      }
    },
  };
  
module.exports = hardwareSchema;