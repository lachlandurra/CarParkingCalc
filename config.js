// config.js

const measureConfig = [
    {
      pattern: /per cent of site area/,
      inputs: [
        {
          id: 'site_area',
          label: 'Site Area (sq m)',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => (rate / 100) * inputs.site_area,
    },
    {
      pattern: /to each 100 sq m of leasable floor area/,
      inputs: [
        {
          id: 'leasable_floor_area',
          label: 'Leasable Floor Area (sq m)',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => (rate * inputs.leasable_floor_area) / 100,
    },
    {
      pattern: /to each 100 sq m of net floor area/,
      inputs: [
        {
          id: 'net_floor_area',
          label: 'Net Floor Area (sq m)',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => (rate * inputs.net_floor_area) / 100,
    },
    {
      pattern: /to each patron permitted/,
      inputs: [
        {
          id: 'number_of_patrons',
          label: 'Number of Patrons Permitted',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_patrons,
    },
    {
      pattern: /to each child/,
      inputs: [
        {
          id: 'number_of_children',
          label: 'Number of Children',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_children,
    },
    {
      pattern: /to each employee/,
      inputs: [
        {
          id: 'number_of_employees',
          label: 'Number of Employees',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_employees,
    },
    {
      pattern: /to each court/,
      inputs: [
        {
          id: 'number_of_courts',
          label: 'Number of Courts',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_courts,
    },
    {
      pattern: /to each rink/,
      inputs: [
        {
          id: 'number_of_rinks',
          label: 'Number of Rinks',
          type: 'number',
          required: true,
        },
        {
          id: 'ancillary_use',
          label: 'Ancillary Use Requirement',
          type: 'number',
          required: false,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_rinks + 0.5 * (inputs.ancillary_use || 0),
    },
    {
      pattern: /to each hole/,
      inputs: [
        {
          id: 'number_of_holes',
          label: 'Number of Holes',
          type: 'number',
          required: true,
        },
        {
          id: 'ancillary_use',
          label: 'Ancillary Use Requirement',
          type: 'number',
          required: false,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_holes + 0.5 * (inputs.ancillary_use || 0),
    },
    {
      pattern: /to each unit/,
      inputs: [
        {
          id: 'number_of_units',
          label: 'Number of Units',
          type: 'number',
          required: true,
        },
        {
          id: 'number_of_manager_dwellings',
          label: 'Number of Manager Dwellings',
          type: 'number',
          required: true,
        },
        {
          id: 'ancillary_use',
          label: 'Ancillary Use Requirement',
          type: 'number',
          required: false,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_units + rate * inputs.number_of_manager_dwellings + 0.5 * (inputs.ancillary_use || 0),
    },
    {
      pattern: /one or two bedroom dwelling/,
      inputs: [
        {
          id: 'one_two_bedroom_dwellings',
          label: 'Number of One or Two Bedroom Dwellings',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.one_two_bedroom_dwellings,
    },
    {
      pattern: /three or more bedroom dwelling/,
      inputs: [
        {
          id: 'three_more_bedroom_dwellings',
          label: 'Number of Three or More Bedroom Dwellings',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.three_more_bedroom_dwellings,
    },
    {
      pattern: /visitors to every (\d+) dwellings/,
      inputs: [
        {
          id: 'number_of_dwellings',
          label: 'Total Number of Dwellings',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate, match) => {
        const factor = Math.floor(inputs.number_of_dwellings / parseInt(match[1], 10));
        return factor * rate;
      },
    },
    {
      pattern: /to each lodging room/,
      inputs: [
        {
          id: 'number_of_lodging_rooms',
          label: 'Number of Lodging Rooms',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.number_of_lodging_rooms,
    },
    {
      pattern: /to each 100 sq m of site/,
      inputs: [
        {
          id: 'site_area',
          label: 'Site Area (sq m)',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => (rate * inputs.site_area) / 100,
    },
    {
      pattern: /to each 100 sq m of site/,
      inputs: [
        {
          id: 'site_area',
          label: 'Site Area (sq m)',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => (rate * inputs.site_area) / 100,
    },
    {
      pattern: /to each premises/,
      inputs: [],
      calculate: (inputs, rate) => rate,
    },
    {
      pattern: /to each 100 sq m of net floor area/,
      inputs: [
        {
          id: 'net_floor_area',
          label: 'Net Floor Area (sq m)',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => (rate * inputs.net_floor_area) / 100,
    },
    {
      pattern: /to each four bedrooms/,
      inputs: [
        {
          id: 'number_of_four_bedrooms',
          label: 'Number of Four Bedrooms',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => Math.floor(inputs.number_of_four_bedrooms / 4) * rate,
    },
    {
      pattern: /to first person providing health services/,
      inputs: [
        {
          id: 'first_persons',
          label: 'Is there a first person providing health services? (Enter 1 if yes, 0 if no)',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.first_persons,
    },
    {
      pattern: /every other person providing health services/,
      inputs: [
        {
          id: 'other_persons',
          label: 'Number of Other Persons Providing Health Services',
          type: 'number',
          required: true,
        },
      ],
      calculate: (inputs, rate) => rate * inputs.other_persons,
    },
    // Add more configurations as needed
  ];
  