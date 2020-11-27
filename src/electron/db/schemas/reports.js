const reportSchema = {
    type: 'object',
    properties: {
      ConstraintID: {
        type: 'string',
      },
      CpuInfo:{
        type:'string'
      },
      GpuInfo:{
        type:'string'
      },
      HddInfo:{
        type:'string'
      },
      RamInfo:{
        type:'string'
      },
      BigNG:{
        type:'string'
      },
      MainBoard:{
        type:'string'
      },
      Chip:{
        type:'string'
      }
    },
  };
  
module.exports = reportSchema;