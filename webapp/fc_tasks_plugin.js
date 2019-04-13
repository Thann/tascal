// Full Calendar Tasks plugin (tascal)

import { View, createPlugin, htmlToElement } from '@fullcalendar/core';

class TasksView extends View {
	initialize() {
	// 	// called once when the view is instantiated, when the user switches to the view.
	// 	// initialize member variables or do other setup tasks.
		//TODO!
		// this.registerInteractiveComponent(this, {
    //   el: this.el
		// })
		console.log("IIII", this)
		this.on('dateClick', (evt) => {
			console.log("EVT!!", evt)
		})
		this.el.onClick = (evt) => {
			console.log("EVT!!", evt)
		}
	}
	// eventClick() {
	// 	console.log("YYYYYYYYYYYS")
	// }
	// //
	// renderSkeleton() {
	// 	// responsible for displaying the skeleton of the view within the already-defined
	// 	// this.el, an HTML element
	// 	// console.log("FFF")
	// 	// this.el.html("GGGGG")
	// }
	// //
	// // unrenderSkeleton() {
	// //   // should undo what renderSkeleton did
	// // }
	// //
	// renderDates(dateProfile) {
	// 	// responsible for rendering the given dates
	// 	// this.el.append(htmlToElement("<div>cool</div>"))
	//
	// }
	//
	// unrenderDates() {
	//   // should undo whatever renderDates does
	// }
	//
	renderEvents(eventStore, eventUiHash) {
	//   // responsible for rendering events
		// this.el.append(htmlToElement("<div>sweet</div>"))
		console.log('EVT STORE', eventStore);
		// this.trigger('derp')
		for (const evt of Object.values(eventStore.defs)) {
			if (!evt.extendedProps.done) {
				// this.el.append(htmlToElement("<div>"+ evt.title+"</div>"))
				this.el.append(this.renderTask(evt));
				break;
			}
		}
	}
	//
	// unrenderEvents() {
	// 	this.el.innerHTML = ''
	// }
	renderTask(evt) {
		return htmlToElement(`
			${evt.title}
			<div class=".location">
				${evt.extendedProps.location}
			</div>
			<button />
		`);
	}
}

export default createPlugin({
	views: {
		tasks: TasksView,
	},
});
