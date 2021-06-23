export let thing = {

	base:"/system/display/box",

	// define where i want this box; and clipping as well as rotation
	xyz:{x:100,y:10},
	ypr:{z:0},
	whd:{x:600,y:60},

	// define border and fill
	// TODO allow a border thickness and bevel
	stroke_style:"grey",
	fill_style:"white",
	text_style:"black",
	text_font:"40px serif",

	text:"Input Bar"

}