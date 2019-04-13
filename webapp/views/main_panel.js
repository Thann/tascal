// MainPanel

import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
require('styles/main_panel.css');

module.exports = Backbone.View.extend({
	id: 'MainPanel',
	className: 'container flex',
	events: {
		'click .open-door': 'openDoor',
	},
	initialize: function() {
		this.calendar = new Calendar(this.el, {
			// defaultView: 'dayGridMonth',
			plugins: [
				interactionPlugin,
				dayGridPlugin,
				timeGridPlugin,
				listPlugin,
			],
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
			},
			defaultDate: '2018-01-12',
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			events: [
				{
					title: 'All Day Event',
					start: '2018-01-01',
				},
			],
		});
	},
	render: function() {
		this.calendar.render();
		return this;
	},
});
