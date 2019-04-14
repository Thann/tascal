// Full Calendar Tasks plugin (tascal)

const $ = require('jquery');
import {
	View,
	htmlEscape,
	createPlugin,
	htmlToElement,
	getAllDayHtml,
	createElement,
	createFormatter,
	isMultiDayRange,
	ScrollComponent,
	FgEventRenderer,
	memoizeRendering,
	buildGotoAnchorHtml,
} from '@fullcalendar/core';
import { ListView } from '@fullcalendar/list';

class FocusView extends View {
	initialize() {
	// 	// called once when the view is instantiated, when the user switches to the view.
	// 	// initialize member variables or do other setup tasks.
		//TODO!
		// this.registerInteractiveComponent(this, {
		//   el: this.el
		// })
		// console.log("IIII", this)
		// this.on('dateClick', (evt) => {
		// 	console.log("EVT!!", evt)
		// })
		// this.el.onClick = (evt) => {
		// 	console.log("EVT!!", evt)
		// }
	}
	eventClick() {
		console.log('YYYYYYYYYYYS');
	}
	//
	renderSkeleton() {
		// responsible for displaying the skeleton of the view within the already-defined
		// this.el, an HTML element
		// console.log("FFF")
		// this.el.html("GGGGG")
	}
	//
	// unrenderSkeleton() {
	//   // should undo what renderSkeleton did
	// }
	//
	renderDates(dateProfile) {
		// responsible for rendering the given dates
		// this.el.append(htmlToElement("<div>cool</div>"))

	}

	unrenderDates() {
		// should undo whatever renderDates does
	}

	renderEvents(eventStore, eventUiHash) {
		//   // responsible for rendering events
		// this.el.append(htmlToElement("<div>sweet</div>"))
		console.log('EVT STORE', eventStore, eventUiHash);
		// this.trigger('derp')
		for (const evt of Object.values(eventStore.instances)) {
			const def = eventStore.defs[evt.defId];
			if (!def.extendedProps.done) {
				// this.el.append(htmlToElement("<div>"+ evt.title+"</div>"))
				const el = this.renderTask(def);
				$(el).on('click', () => {
					console.log('FUCK!!!!', def, this);
					this.trigger('eventClicked');
					// evt.setExtendedProp('done', true);
					// evt.extendedProps.done = true;
				});

				this.el.append(el);
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
			<div>
				${evt.title}
				<div class=".location">
					${evt.extendedProps.location || ''}
				</div>
				<button class="btn btn-default">DONE!</button>
			</div>
		`);
	}
}

class TasksView extends ListView {
	constructor(context, viewSpec, dateProfileGenerator, parentEl) {
		super(context, viewSpec, dateProfileGenerator, parentEl);

		const eventRenderer =  new TaskListEventRenderer(this);
		this.eventRenderer = eventRenderer;
		this.renderContent = memoizeRendering(
			eventRenderer.renderSegs.bind(eventRenderer),
			eventRenderer.unrender.bind(eventRenderer)
		);

		this.el.classList.add('fc-list-view');

		const listViewClassNames = (this.theme.getClass('listView') || '').split(' '); // wish we didn't have to do this
		for (const listViewClassName of listViewClassNames) {
			if (listViewClassName) { // in case input was empty string
				this.el.classList.add(listViewClassName);
			}
		}

		this.scroller = new ScrollComponent(
			'hidden', // overflow x
			'auto' // overflow y
		);

		this.el.appendChild(this.scroller.el);
		this.contentEl = this.scroller.el; // shortcut

		context.calendar.registerInteractiveComponent(this, {
			el: this.el,
			// TODO: make aware that it doesn't do Hits
		});
	}

	// generates the HTML for the day headers that live amongst the event rows
	buildDayHeaderRow(dayDate) {
		const { dateEnv } = this;
		const mainFormat = createFormatter(this.opt('listDayFormat')); // TODO: cache
		const altFormat = createFormatter(this.opt('listDayAltFormat')); // TODO: cache

		return createElement('tr', {
			className: 'fc-list-heading',
			'data-date': dateEnv.formatIso(dayDate, { omitTime: true }),
		}, '<td class="' + (
			this.calendar.theme.getClass('tableListHeading') ||
			this.calendar.theme.getClass('widgetHeader')
		) + '" colspan="4">' +
			(mainFormat ?
				buildGotoAnchorHtml(
					this,
					dayDate,
					{ 'class': 'fc-list-heading-main' },
					htmlEscape(dateEnv.format(dayDate, mainFormat)) // inner HTML
				) :
				'') +
			(altFormat ?
				buildGotoAnchorHtml(
					this,
					dayDate,
					{ 'class': 'fc-list-heading-alt' },
					htmlEscape(dateEnv.format(dayDate, altFormat)) // inner HTML
				) :
				'') +
		'</td>');
	}
}

class TaskListEventRenderer extends FgEventRenderer {
	constructor(listView) {
		super(listView.context);
		this.listView = listView;
	}

	attachSegs(segs) {
		if (!segs.length) {
			this.listView.renderEmptyMessage();
		} else {
			this.listView.renderSegList(segs);
		}
	}

	detachSegs() {
	}

	// generates the HTML for a single event row
	renderSegHtml(seg) {
		const { view, theme } = this.context;
		const eventRange = seg.eventRange;
		const eventDef = eventRange.def;
		const eventInstance = eventRange.instance;
		const eventUi = eventRange.ui;
		const url = eventDef.url;
		const classes = ['fc-list-item'].concat(eventUi.classNames);
		const bgColor = eventUi.backgroundColor;
		let timeHtml;

		if (eventDef.allDay) {
			timeHtml = getAllDayHtml(view);
		} else if (isMultiDayRange(eventRange.range)) {
			if (seg.isStart) {
				timeHtml = htmlEscape(this._getTimeText(
					eventInstance.range.start,
					seg.end,
					false // allDay
				));
			} else if (seg.isEnd) {
				timeHtml = htmlEscape(this._getTimeText(
					seg.start,
					eventInstance.range.end,
					false // allDay
				));
			} else { // inner segment that lasts the whole day
				timeHtml = getAllDayHtml(view);
			}
		} else {
			// Display the normal time text for the *event's* times
			timeHtml = htmlEscape(this.getTimeText(eventRange));
		}

		if (url) {
			classes.push('fc-has-url');
		}

		return '<tr class="' + classes.join(' ') + '">' +
			(this.displayEventTime ?
				'<td class="fc-list-item-time ' + theme.getClass('widgetContent') + '">' +
					(timeHtml || '') +
				'</td>' :
				'') +
			'<td class="fc-list-item-marker ' + theme.getClass('widgetContent') + '">' +
				'<span class="fc-event-dot"' +
				(bgColor ?
					' style="background-color:' + bgColor + '"' :
					'') +
				'></span>' +
			'</td>' +
			'<td class="fc-list-item-time ' + theme.getClass('widgetContent') + '">' +

				(!eventInstance.done ?
					'<button class="btn btn-default"> DONE! </button>' :
					'DONE!!') +
			'</td>' +
			'<td class="fc-list-item-title ' + theme.getClass('widgetContent') + '">' +
				'<a' + (url ? ' href="' + htmlEscape(url) + '"' : '') + '>' +
					htmlEscape(eventDef.title || '') +
				'</a>' +
			'</td>' +
		'</tr>';
	}

	// like "4:00am"
	computeEventTimeFormat() {
		return {
			hour: 'numeric',
			minute: '2-digit',
			meridiem: 'short',
		};
	}
}

export default createPlugin({
	views: {
		focus: FocusView,
		tasks: {
			class: TasksView,
			buttonTextKey: 'tasks', // what to lookup in locale files
		},
	},
});
