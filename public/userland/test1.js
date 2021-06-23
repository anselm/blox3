
let amount = 0

function stepper() {
	amount = amount + 1
	return 900 - 70*amount
}

export let thing = {

			base:"/system/display/box",
			xyz:{x:10,y:10},
			whd:{x:900,y:900},
			mybox:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"40px serif",

				text:"Operating System"
	
			},

			mybox2:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"40px serif",

				text:"Hardware"
	
			},


			mybox3:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"40px serif",

				text:"Browser"
	
			},


			mybox4:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"20px serif",

				text:"Display / Filesystem / Network / Serial / Bluetooth / Camera"
	
			},


			mybox5:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"20px serif",

				text:"WASI Permissions Boundary",
			},

			mybox6:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"20px serif",

				text:"Task Manager",
			},

			mybox7:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"20px serif",

				text:"NNAPI / Tensorflow / MLCore / WebXR / Third Party Modules",
			},

			mybox8:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"20px serif",

				text:"Desktop UX",
			},

			mybox9:{

				base:"/system/display/box", // TODO it is a bit verbose

				// define where i want this box; and clipping as well as rotation
				xyz:{x:100,y:stepper()},
				ypr:{z:0},
				whd:{x:600,y:60},

				// define border and fill
				// TODO allow a border thickness and bevel
				stroke_style:"grey",
				fill_style:"white",
				text_style:"black",
				text_font:"20px serif",

				text:"Third Party Apps (fetched over web)",
			}

/*
	[third party apps]
	[desktop ux]
	[nnapi][tensorflow][mlcore][webxr][third party modules]
	[task manager][scripting]
	[wasi permissions layer]
	[filesystem][network][serial/usb][bluetooth][display][camera]
	[kernel component manager]
[Browser App]
[OS]
[hardware]
*/


	
	
}
