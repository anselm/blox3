# Blox3

This is a largely declarative grammar intended to let novice (non-technical) people have a way to produce a collection of software objects and their relationships into a computer.

## Uses

I imagine it being used to sketch a wide range of experiences such as:

	- easily make small audio toys by wiring different kinds of sound processing units together
	- make and share 3d animated vignettes such as 'standing underneath a cherry blossom tree with petals falling'
	- wire together applications on the fly such as a face-identifier app with a camera input and face segmenter
	- make a collection of photos grouped into pages to share with friends
	- ie: making something like this https://www.patatap.com/

## Design choices

1. Javascript based -> the parser effectively turns javascript hashes into objects (of base class type "Node")

2. DAG -> data objects are arranged as a directed acyclic graph

3. Filesystem Path Style -> uses a file system like path naming convention ie: /parent/child/subchild

4. Event Handlers -> does allow custom procedural code functions as leaf/edge properties of a data object

5. Event Delegate to Parents -> has a message driven philosophy where parent nodes get messages to act on children

6. Marshaling -> some emphasis on serialization / deserialization to make it easier to do networking.

7. Typing -> Instances can be derived from "Node" or a network loadable javascript class or as a clone of a prototype

8. Multiple graphs -> there is a resource graph folded with an instance graph, there are relationship graphs

## Internal management system

You describe objects in a dag. But behind the scenes when you're asking for a node you're basically asking the system to guarantee your concept. The reality can be implemented in a way vastly different from what your perception of it is. For example making a "/system/display/window" feels intuitive, but behind the scenes it can order the system to produce a display engine first. The dag is a user facing conceit that does not necessarily map to physical reality.

There are two separate graphs here; there is a resource graph (where a capability is stored), and then an instance graph, of how you are organizing your own instances.

## Example Grammar

	let myarea = {
		base:"/system/node"					// any generic node type; basically just a bucket
		author:"bob@bob.com"
		mywindow:{
			base:"/system/display/window"	// this presumes that a display capability exists; it will rely on it
			backround:"blue",
			mycamera:{
				base:"/system/display/camera",
				aperture:12,
				lens:1234,
			}
		}
	}

## Some Node Types

1. Node    -> a generic node
2. System  -> this is the root of the tree, other branches are added to it
3. Context -> it feels like a context is a useful idea especially for inter-context comms
4. Display -> right now each context can just make a window and magically they share the one display
	1. Box     -> this is a kind of omni component for displays that has many powers; layout, images, text, dimensions
	2. Input   -> a thing that can accept input
	3. Lines
	4. Anims

## todo

	- grammar; think about improving prototype support
	- grammar; perms in the core would be nice
	- grammar; can i import lifecards


	- boxes to do
		- display needs to pipe touch events
		- and boxes need to be responsive
		- rotate improve
		- layout (resize children); and move children to edges and so on for nice layouts
		- hit zones
		- images
		- transform hierarchies

	- test
		- test blox2 stuff
		- test blox1 stuff
		- test audio toys
		- a 3d chat that is interactive creator?
		- lifecards?
		- a desktop gui

