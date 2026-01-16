export const sampleCaliperApiResponse = {
  success: true,
  message:
    "Successfully retrieved caliper measurements by group for experiment 2",
  data: {
    tabs: [
      {
        tab_id: "M_ATH_20251111_BxPC3_20260111",
        tab_label: "Male ATH | DOB: 11/11/2025 | BxPC3 | Inj: 11/01/2026",
        metadata: {
          sex: "Male",
          strain: "ATH",
          date_of_birth: "11/11/2025",
          cell_line: "BxPC3",
          cell_injection_date: "11/01/2026",
        },
        group_data_by_group_id: {
          "18": {
            id: 18,
            group_code: "A",
            group_name: "A",
          },
          "19": {
            id: 19,
            group_code: "B",
            group_name: "B",
          },
        },
        mouse_data_by_delivery_id: {
          "1111-01-17": {
            id: 313,
            mouse_code: "A1",
            delivery_id: "1111-01-17",
          },
          "1111-01-16": {
            id: 312,
            mouse_code: "B1",
            delivery_id: "1111-01-16",
          },
          "1111-01-15": {
            id: 311,
            mouse_code: "A2",
            delivery_id: "1111-01-15",
          },
          "1111-01-14": {
            id: 310,
            mouse_code: "B2",
            delivery_id: "1111-01-14",
          },
          "1111-01-13": {
            id: 309,
            mouse_code: "A3",
            delivery_id: "1111-01-13",
          },
          "1111-01-12": {
            id: 308,
            mouse_code: "B3",
            delivery_id: "1111-01-12",
          },
          "1111-01-11": {
            id: 307,
            mouse_code: "A4",
            delivery_id: "1111-01-11",
          },
          "1111-01-10": {
            id: 306,
            mouse_code: "B4",
            delivery_id: "1111-01-10",
          },
          "1111-01-09": {
            id: 305,
            mouse_code: "A5",
            delivery_id: "1111-01-09",
          },
          "1111-01-08": {
            id: 304,
            mouse_code: "B5",
            delivery_id: "1111-01-08",
          },
        },
        caliper_measurements: {
          "18": {
            "1111-01-17": {
              "11/01/2026": {
                width_mm: 10,
                length_mm: 20,
                volume_mm3: 1000,
              },
              "13/01/2026": {
                width_mm: 10.2,
                length_mm: 20.1,
                volume_mm3: 1030,
              },
              "15/01/2026": {
                width_mm: 10.5,
                length_mm: 20.3,
                volume_mm3: 1089,
              },
              "17/01/2026": {
                width_mm: 10.8,
                length_mm: 20.6,
                volume_mm3: 1156,
              },
            },
            "1111-01-15": {
              "11/01/2026": {
                width_mm: 8,
                length_mm: 18,
                volume_mm3: 576,
              },
              "13/01/2026": {
                width_mm: 8.1,
                length_mm: 18.2,
                volume_mm3: 606,
              },
              "15/01/2026": {
                width_mm: 8.3,
                length_mm: 18.5,
                volume_mm3: 643,
              },
              "17/01/2026": {
                width_mm: 8.6,
                length_mm: 18.8,
                volume_mm3: 687,
              },
            },
            "1111-01-13": {
              "11/01/2026": {
                width_mm: 6,
                length_mm: 16,
                volume_mm3: 288,
              },
              "13/01/2026": {
                width_mm: 6.2,
                length_mm: 16.3,
                volume_mm3: 325,
              },
              "15/01/2026": {
                width_mm: 6.5,
                length_mm: 16.7,
                volume_mm3: 371,
              },
              "17/01/2026": {
                width_mm: 6.8,
                length_mm: 17.1,
                volume_mm3: 422,
              },
            },
            "1111-01-11": {
              "11/01/2026": {
                width_mm: 4,
                length_mm: 14,
                volume_mm3: 112,
              },
              "13/01/2026": {
                width_mm: 4.2,
                length_mm: 14.3,
                volume_mm3: 133,
              },
              "15/01/2026": {
                width_mm: 4.5,
                length_mm: 14.7,
                volume_mm3: 159,
              },
              "17/01/2026": {
                width_mm: 4.8,
                length_mm: 15.2,
                volume_mm3: 190,
              },
            },
            "1111-01-09": {
              "11/01/2026": {
                width_mm: 2,
                length_mm: 12,
                volume_mm3: 24,
              },
              "13/01/2026": {
                width_mm: 2.3,
                length_mm: 12.5,
                volume_mm3: 36,
              },
              "15/01/2026": {
                width_mm: 2.6,
                length_mm: 13.1,
                volume_mm3: 51,
              },
              "17/01/2026": {
                width_mm: 3.0,
                length_mm: 13.8,
                volume_mm3: 71,
              },
            },
          },
          "19": {
            "1111-01-16": {
              "11/01/2026": {
                width_mm: 9,
                length_mm: 19,
                volume_mm3: 769.5,
              },
              "13/01/2026": {
                width_mm: 9.3,
                length_mm: 19.4,
                volume_mm3: 875,
              },
              "15/01/2026": {
                width_mm: 9.7,
                length_mm: 19.8,
                volume_mm3: 995,
              },
              "17/01/2026": {
                width_mm: 10.1,
                length_mm: 20.3,
                volume_mm3: 1128,
              },
            },
            "1111-01-14": {
              "11/01/2026": {
                width_mm: 7,
                length_mm: 17,
                volume_mm3: 416.5,
              },
              "13/01/2026": {
                width_mm: 7.4,
                length_mm: 17.5,
                volume_mm3: 507,
              },
              "15/01/2026": {
                width_mm: 7.8,
                length_mm: 18.1,
                volume_mm3: 616,
              },
              "17/01/2026": {
                width_mm: 8.2,
                length_mm: 18.7,
                volume_mm3: 745,
              },
            },
            "1111-01-12": {
              "11/01/2026": {
                width_mm: 5,
                length_mm: 15,
                volume_mm3: 187.5,
              },
              "13/01/2026": {
                width_mm: 5.3,
                length_mm: 15.5,
                volume_mm3: 235,
              },
              "15/01/2026": {
                width_mm: 5.7,
                length_mm: 16.1,
                volume_mm3: 296,
              },
              "17/01/2026": {
                width_mm: 6.1,
                length_mm: 16.8,
                volume_mm3: 371,
              },
            },
            "1111-01-10": {
              "11/01/2026": {
                width_mm: 3,
                length_mm: 13,
                volume_mm3: 58.5,
              },
              "13/01/2026": {
                width_mm: 3.4,
                length_mm: 13.6,
                volume_mm3: 83,
              },
              "15/01/2026": {
                width_mm: 3.8,
                length_mm: 14.3,
                volume_mm3: 117,
              },
              "17/01/2026": {
                width_mm: 4.2,
                length_mm: 15.1,
                volume_mm3: 162,
              },
            },
            "1111-01-08": {
              "11/01/2026": {
                width_mm: 1,
                length_mm: 11,
                volume_mm3: 5.5,
              },
              "13/01/2026": {
                width_mm: 1.5,
                length_mm: 11.8,
                volume_mm3: 13,
              },
              "15/01/2026": {
                width_mm: 2.1,
                length_mm: 12.7,
                volume_mm3: 27,
              },
              "17/01/2026": {
                width_mm: 2.8,
                length_mm: 13.6,
                volume_mm3: 50,
              },
            },
          },
        },
        caliper_measurements_dates: [
          "11/01/2026",
          "13/01/2026",
          "15/01/2026",
          "17/01/2026",
        ],
      },
      {
        tab_id: "F_NOD_20251201_HepG2_20260105",
        tab_label: "Female NOD | DOB: 01/12/2025 | HepG2 | Inj: 05/01/2026",
        metadata: {
          sex: "Female",
          strain: "NOD",
          date_of_birth: "01/12/2025",
          cell_line: "HepG2",
          cell_injection_date: "05/01/2026",
        },
        group_data_by_group_id: {
          "20": {
            id: 20,
            group_code: "C",
            group_name: "Control",
          },
          "21": {
            id: 21,
            group_code: "T",
            group_name: "Treatment",
          },
        },
        mouse_data_by_delivery_id: {
          "2222-02-01": {
            id: 401,
            mouse_code: "C1",
            delivery_id: "2222-02-01",
          },
          "2222-02-02": {
            id: 402,
            mouse_code: "T1",
            delivery_id: "2222-02-02",
          },
          "2222-02-03": {
            id: 403,
            mouse_code: "C2",
            delivery_id: "2222-02-03",
          },
          "2222-02-04": {
            id: 404,
            mouse_code: "T2",
            delivery_id: "2222-02-04",
          },
          "2222-02-05": {
            id: 405,
            mouse_code: "C3",
            delivery_id: "2222-02-05",
          },
          "2222-02-06": {
            id: 406,
            mouse_code: "T3",
            delivery_id: "2222-02-06",
          },
        },
        caliper_measurements: {
          "20": {
            "2222-02-01": {
              "12/01/2026": {
                width_mm: 5.5,
                length_mm: 11.2,
                volume_mm3: 345.4,
              },
              "14/01/2026": {
                width_mm: 5.8,
                length_mm: 11.6,
                volume_mm3: 389.2,
              },
              "16/01/2026": {
                width_mm: 6.1,
                length_mm: 12.1,
                volume_mm3: 448.7,
              },
            },
            "2222-02-03": {
              "12/01/2026": {
                width_mm: 4.9,
                length_mm: 10.8,
                volume_mm3: 287.5,
              },
              "14/01/2026": {
                width_mm: 5.2,
                length_mm: 11.2,
                volume_mm3: 326.1,
              },
              "16/01/2026": {
                width_mm: 5.5,
                length_mm: 11.7,
                volume_mm3: 373.8,
              },
            },
            "2222-02-05": {
              "12/01/2026": {
                width_mm: 6.2,
                length_mm: 12.4,
                volume_mm3: 477.3,
              },
              "14/01/2026": {
                width_mm: 6.6,
                length_mm: 12.9,
                volume_mm3: 559.2,
              },
              "16/01/2026": {
                width_mm: 7.1,
                length_mm: 13.5,
                volume_mm3: 670.4,
              },
            },
          },
          "21": {
            "2222-02-02": {
              "12/01/2026": {
                width_mm: 8.1,
                length_mm: 15.3,
                volume_mm3: 949.8,
              },
              "14/01/2026": {
                width_mm: 8.7,
                length_mm: 16.1,
                volume_mm3: 1128.4,
              },
              "16/01/2026": {
                width_mm: 9.4,
                length_mm: 17.2,
                volume_mm3: 1387.2,
              },
            },
            "2222-02-04": {
              "12/01/2026": {
                width_mm: 7.3,
                length_mm: 14.1,
                volume_mm3: 728.9,
              },
              "14/01/2026": {
                width_mm: 7.9,
                length_mm: 14.8,
                volume_mm3: 868.7,
              },
              "16/01/2026": {
                width_mm: 8.5,
                length_mm: 15.6,
                volume_mm3: 1034.1,
              },
            },
            "2222-02-06": {
              "12/01/2026": {
                width_mm: 9.8,
                length_mm: 18.2,
                volume_mm3: 1622.3,
              },
              "14/01/2026": {
                width_mm: 10.5,
                length_mm: 19.1,
                volume_mm3: 1928.7,
              },
              "16/01/2026": {
                width_mm: 11.3,
                length_mm: 20.4,
                volume_mm3: 2367.8,
              },
            },
          },
        },
        caliper_measurements_dates: ["12/01/2026", "14/01/2026", "16/01/2026"],
      },
      {
        tab_id: "M_C57BL6_20251220_A549_20260108",
        tab_label: "Male C57BL/6 | DOB: 20/12/2025 | A549 | Inj: 08/01/2026",
        metadata: {
          sex: "Male",
          strain: "C57BL/6",
          date_of_birth: "20/12/2025",
          cell_line: "A549",
          cell_injection_date: "08/01/2026",
        },
        group_data_by_group_id: {
          "22": {
            id: 22,
            group_code: "V",
            group_name: "Vehicle",
          },
          "23": {
            id: 23,
            group_code: "D",
            group_name: "Drug",
          },
        },
        mouse_data_by_delivery_id: {
          "3333-03-01": {
            id: 501,
            mouse_code: "V1",
            delivery_id: "3333-03-01",
          },
          "3333-03-02": {
            id: 502,
            mouse_code: "D1",
            delivery_id: "3333-03-02",
          },
          "3333-03-03": {
            id: 503,
            mouse_code: "V2",
            delivery_id: "3333-03-03",
          },
          "3333-03-04": {
            id: 504,
            mouse_code: "D2",
            delivery_id: "3333-03-04",
          },
        },
        caliper_measurements: {
          "22": {
            "3333-03-01": {
              "14/01/2026": {
                width_mm: 12.3,
                length_mm: 18.7,
                volume_mm3: 1347.2,
              },
              "16/01/2026": {
                width_mm: 13.1,
                length_mm: 19.8,
                volume_mm3: 1612.4,
              },
            },
            "3333-03-03": {
              "14/01/2026": {
                width_mm: 11.8,
                length_mm: 17.9,
                volume_mm3: 1189.3,
              },
              "16/01/2026": {
                width_mm: 12.4,
                length_mm: 18.5,
                volume_mm3: 1421.8,
              },
            },
          },
          "23": {
            "3333-03-02": {
              "14/01/2026": {
                width_mm: 7.2,
                length_mm: 13.4,
                volume_mm3: 524.7,
              },
              "16/01/2026": {
                width_mm: 6.8,
                length_mm: 12.9,
                volume_mm3: 467.3,
              },
            },
            "3333-03-04": {
              "14/01/2026": {
                width_mm: 8.1,
                length_mm: 14.2,
                volume_mm3: 659.8,
              },
              "16/01/2026": {
                width_mm: 7.6,
                length_mm: 13.7,
                volume_mm3: 578.2,
              },
            },
          },
        },
        caliper_measurements_dates: ["14/01/2026", "16/01/2026"],
      },
    ],
  },
};

export const sampleCaliperHistoryResponse = {
  success: true,
  message:
    "Successfully retrieved caliper measurements by mouse for experiment 2",
  data: {
    tabs: [
      {
        tab_id: "M_ATH_20251111_BxPC3_20260111",
        tab_label: "Male ATH | DOB: 11/11/2025 | BxPC3 | Inj: 11/01/2026",
        metadata: {
          sex: "Male",
          strain: "ATH",
          date_of_birth: "11/11/2025",
          cell_line: "BxPC3",
          cell_injection_date: "11/01/2026",
        },
        mouse_data_by_delivery_id: {
          "1111-01-17": {
            id: 313,
            mouse_code: "A1",
            delivery_id: "1111-01-17",
          },
          "1111-01-16": {
            id: 312,
            mouse_code: "B1",
            delivery_id: "1111-01-16",
          },
          "1111-01-15": {
            id: 311,
            mouse_code: "A2",
            delivery_id: "1111-01-15",
          },
          "1111-01-14": {
            id: 310,
            mouse_code: "B2",
            delivery_id: "1111-01-14",
          },
          "1111-01-13": {
            id: 309,
            mouse_code: "A3",
            delivery_id: "1111-01-13",
          },
          "1111-01-12": {
            id: 308,
            mouse_code: "B3",
            delivery_id: "1111-01-12",
          },
          "1111-01-11": {
            id: 307,
            mouse_code: "A4",
            delivery_id: "1111-01-11",
          },
          "1111-01-10": {
            id: 306,
            mouse_code: "B4",
            delivery_id: "1111-01-10",
          },
          "1111-01-09": {
            id: 305,
            mouse_code: "A5",
            delivery_id: "1111-01-09",
          },
          "1111-01-08": {
            id: 304,
            mouse_code: "B5",
            delivery_id: "1111-01-08",
          },
        },
        caliper_measurements: {
          "1111-01-17": {
            "11/01/2026": {
              width_mm: 10,
              length_mm: 20,
              volume_mm3: 1000,
            },
            "13/01/2026": {
              width_mm: 10,
              length_mm: 20,
              volume_mm3: 1000,
            },
            "15/01/2026": {
              width_mm: 10,
              length_mm: 20,
              volume_mm3: 1000,
            },
            "17/01/2026": {
              width_mm: 10,
              length_mm: 20,
              volume_mm3: 1000,
            },
          },
          "1111-01-16": {
            "11/01/2026": {
              width_mm: 9,
              length_mm: 19,
              volume_mm3: 769.5,
            },
            "13/01/2026": {
              width_mm: 9,
              length_mm: 19,
              volume_mm3: 769.5,
            },
            "15/01/2026": {
              width_mm: 9,
              length_mm: 19,
              volume_mm3: 769.5,
            },
            "17/01/2026": {
              width_mm: 9,
              length_mm: 19,
              volume_mm3: 769.5,
            },
          },
          "1111-01-15": {
            "11/01/2026": {
              width_mm: 8,
              length_mm: 18,
              volume_mm3: 576,
            },
            "13/01/2026": {
              width_mm: 8,
              length_mm: 18,
              volume_mm3: 576,
            },
            "15/01/2026": {
              width_mm: 8,
              length_mm: 18,
              volume_mm3: 576,
            },
            "17/01/2026": {
              width_mm: 8,
              length_mm: 18,
              volume_mm3: 576,
            },
          },
          "1111-01-14": {
            "11/01/2026": {
              width_mm: 7,
              length_mm: 17,
              volume_mm3: 416.5,
            },
            "13/01/2026": {
              width_mm: 7,
              length_mm: 17,
              volume_mm3: 416.5,
            },
            "15/01/2026": {
              width_mm: 7,
              length_mm: 17,
              volume_mm3: 416.5,
            },
            "17/01/2026": {
              width_mm: 7,
              length_mm: 17,
              volume_mm3: 416.5,
            },
          },
          "1111-01-13": {
            "11/01/2026": {
              width_mm: 6,
              length_mm: 16,
              volume_mm3: 288,
            },
            "13/01/2026": {
              width_mm: 6,
              length_mm: 16,
              volume_mm3: 288,
            },
            "15/01/2026": {
              width_mm: 6,
              length_mm: 16,
              volume_mm3: 288,
            },
            "17/01/2026": {
              width_mm: 6,
              length_mm: 16,
              volume_mm3: 288,
            },
          },
          "1111-01-12": {
            "11/01/2026": {
              width_mm: 5,
              length_mm: 15,
              volume_mm3: 187.5,
            },
            "13/01/2026": {
              width_mm: 5,
              length_mm: 15,
              volume_mm3: 187.5,
            },
            "15/01/2026": {
              width_mm: 5,
              length_mm: 15,
              volume_mm3: 187.5,
            },
            "17/01/2026": {
              width_mm: 5,
              length_mm: 15,
              volume_mm3: 187.5,
            },
          },
          "1111-01-11": {
            "11/01/2026": {
              width_mm: 4,
              length_mm: 14,
              volume_mm3: 112,
            },
            "13/01/2026": {
              width_mm: 4,
              length_mm: 14,
              volume_mm3: 112,
            },
            "15/01/2026": {
              width_mm: 4,
              length_mm: 14,
              volume_mm3: 112,
            },
            "17/01/2026": {
              width_mm: 4,
              length_mm: 14,
              volume_mm3: 112,
            },
          },
          "1111-01-10": {
            "11/01/2026": {
              width_mm: 3,
              length_mm: 13,
              volume_mm3: 58.5,
            },
            "13/01/2026": {
              width_mm: 3,
              length_mm: 13,
              volume_mm3: 58.5,
            },
            "15/01/2026": {
              width_mm: 3,
              length_mm: 13,
              volume_mm3: 58.5,
            },
            "17/01/2026": {
              width_mm: 3,
              length_mm: 13,
              volume_mm3: 58.5,
            },
          },
          "1111-01-09": {
            "11/01/2026": {
              width_mm: 2,
              length_mm: 12,
              volume_mm3: 24,
            },
            "13/01/2026": {
              width_mm: 2,
              length_mm: 12,
              volume_mm3: 24,
            },
            "15/01/2026": {
              width_mm: 2,
              length_mm: 12,
              volume_mm3: 24,
            },
            "17/01/2026": {
              width_mm: 2,
              length_mm: 12,
              volume_mm3: 24,
            },
          },
          "1111-01-08": {
            "11/01/2026": {
              width_mm: 1,
              length_mm: 11,
              volume_mm3: 5.5,
            },
            "13/01/2026": {
              width_mm: 1,
              length_mm: 11,
              volume_mm3: 5.5,
            },
            "15/01/2026": {
              width_mm: 1,
              length_mm: 11,
              volume_mm3: 5.5,
            },
            "17/01/2026": {
              width_mm: 1,
              length_mm: 11,
              volume_mm3: 5.5,
            },
          },
        },
        caliper_measurements_dates: [
          "11/01/2026",
          "13/01/2026",
          "15/01/2026",
          "17/01/2026",
        ],
      },
    ],
  },
};
