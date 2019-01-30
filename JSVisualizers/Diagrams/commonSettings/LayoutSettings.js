
export function LayoutSettings(){

    this.stiffness = 400.0;
    this.repulsion = 500.0;
    this.damping = 0.5;

    this.colourScheme = {
        mapbackgroundColour: 'white',//'#0A0A33',

        normalMainLabelColour: 'black',
        normalMainLabelBackground: 'white',
        normalMainShapeBackground: 'black',

        selectedMainLabelColour: 'purple',
        selectedMainLabelBackground: 'white',
        selectedMainShapeBackground: 'black',

        nearestMainLabelColour: 'blue',
        nearestMainLabelBackground: 'white',
        nearestMainShapeBackground: 'blue',


        normalInfoLabelColour: 'black',
        normalInfoLabelBackground: 'white',

        selectedInfoLabelColour: 'black',
        selectedInfoLabelBackground: 'white',

        nearestInfoLabelColour: 'white',
        nearestInfoLabelBackground: '#0A0A33',


        infoLineColour: '#0A0A33',
        normalLineGradient: ['#0066FF', '#1975FF', '#3385FF', '#4D94FF', '#66A3FF', '#80B2FF', '#99C2FF', '#CCE0FF', '#E6F0FF'],

        shadowColour: 'black',
       // maleColour: 'purple',
    //    femaleColour: 'purple'
    };

    this.speed =3000;
    this.increment =5;
    this.year = 1670;
    this.sublayoutZoom= 8500;
    this.sublayoutNodeThreshold = 20;
}
