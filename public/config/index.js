exports.message = {
  Room: {
    MeetingRoom02: [
      {
        title: 'temperature',
        name: '温度',
        show: true,
        value: null
      },
      {
        title: 'humidity',
        name: '湿度',
        show: true,
        value: null
      },
      {
        title: 'count',
        name: '人数',
        show: true,
        value: null
      }
    ],
    TeaRoom: [
      {
        title: 'temperature',
        name: '温度',
        show: true,
        value: null
      }
    ],
    Corridor: [
      {
        title: 'temperature',
        name: '温度',
        show: true,
        value: null
      }
    ],
    Office: [
      {
        title: 'temperature',
        name: '温度',
        show: true,
        value: null
      },
      {
        title: 'humidity',
        name: '湿度',
        show: true,
        value: null
      },
      {
        title: 'count',
        name: '人数',
        show: true,
        value: null
      }
    ]
  },
  Devices: {
    MeetingRoom02: {
      air_condition: {
        id: 'meetingroom02_ac001',
        type: '空调',
        Properties: null,
        State: {
          current_ac_state: {
            show: true,
            name: '当前状态',
            value: null
          }
        },
        show: true
      },
      TV: {
        id: 'meetingroom02_tv001',
        type: '电视',
        Properties: null,
        State: [{
          title: 'current_tv_state',
          show: true,
          name: '当前状态',
          value: null
        }],
        show: false
      }
    },
    TeaRoom: {
      air_condition: {
        id: 'tearoom01_ac001',
        type: '空调',
        Properties: null,
        State: {
          current_ac_state: {
            show: true,
            name: '当前状态',
            value: null
          }
        },
        show: true
      },
      water: {
        id: 'tearoom01_waterdispenser001',
        type: '饮水机',
        Properties: null,
        State: {
          current_waterdispenser_state: {
            show: true,
            name: '当前状态',
            value: null
          }
        },
        show: true
      },
      coffee: {
        id: 'tearoom01_coffeemachine001',
        type: '咖啡机',
        Properties: {
          weight: {
            show: true,
            name: '重量',
            value: null
          }
        },
        State: {
          current_coffee_machine_state: {
            show: true,
            name: '当前状态',
            value: null
          }
        },
        show: true
      }
    },
    Corridor: {
    },
    Office: {
      air_condition: {
        id: 'laboratory01_ac001',
        type: '空调',
        Properties: null,
        State: {
          current_ac_state: {
            show: true,
            name: '当前状态',
            value: null
          }
        },
        show: true
      },
      print: {
        id: 'laboratory01_printer001',
        type: '打印机',
        Properties: {
          brand: {
            show: true,
            name: '品牌',
            value: null
          }
        },
        State: {
          printer_work_state: {
            show: true,
            name: '当前状态',
            value: null
          }
        },
        show: true
      }
    }
  },
  // 房间信息中的门窗灯
  Room_devices: {
    Office: {
      window: {
        id1: 'laboratory01_window001',
        id2: 'laboratory01_window002',
        type: '窗户',
        State: {
          current_window_state: {
            show: false,
            name: '窗状态',
            value: null
          }
        },
        show: false
      },
      door: {
        id: 'laboratory01_door001',
        type: '门',
        State: {
          current_door_state: {
            show: true,
            name: '门状态',
            value: null
          }
        },
        show: true
      },
      light: {
        id: 'laboratory01_light001',
        type: '灯',
        State: {
          current_light_state: {
            show: true,
            name: '灯光状态',
            value: null
          },
          current_illuminance: {
            show: true,
            name: '光照强度',
            value: null
          }
        },
        show: true
      }
    },
    MeetingRoom02: {
      window: {
        id: 'meetingroom02_window001',
        type: '窗户',
        State: {
          current_window_state: {
            show: false,
            name: '窗状态',
            value: null
          }
        },
        show: false
      },
      door: {
        id: 'meetingroom02_door001',
        type: '门',
        State: {
          current_door_state: {
            show: true,
            name: '门状态',
            value: null
          }
        },
        show: true
      },
      light: {
        id: 'meetingroom02_light001',
        type: '灯',
        State: {
          current_light_state: {
            show: true,
            name: '灯光状态',
            value: null
          },
          current_illuminance: {
            show: true,
            name: '光照强度',
            value: null
          }
        },
        show: true
      }
    },
    TeaRoom: {
      window: {
        id: 'tearoom01_window001',
        type: '窗户',
        State: {
          current_window_state: {
            show: false,
            name: '窗状态',
            value: null
          }
        },
        show: false
      },
      light: {
        id: 'tearoom01_light001',
        type: '灯',
        State: {
          current_light_state: {
            show: true,
            name: '灯光状态',
            value: null
          },
          current_illuminance: {
            show: true,
            name: '光照强度',
            value: null
          }
        },
        show: false
      }
    },
    Corridor: {
    }
  }
}
