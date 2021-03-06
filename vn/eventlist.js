YUI.add("vn-eventlist",function(Y){

	function EventList(){
		EventList.superclass.constructor.apply(this,arguments);
	}

	EventList.ATTRS = {
		UserInterface: {
			value : undefined
		},
		registeredEvents: {
			value : {}
		},
		currentEvents: {
			value: []
		}
	}

	Y.extend(EventList,Y.Base,{
		initializer: function(){
			this.publish("stackScript",{
				emitFacade: false
			});
			this.publish("gotoScript",{
				emitFacade: false
			});
			this.publish("scriptLoaded",{
				emitFacade: false
			});
			Y.later(1000/60,this,this.processEvents,[],true);
		},
		newEvent: function(evt){
			evt.addToList(this);
			evt.addToUI(this.get("UserInterface"));
			this.get("currentEvents").push(evt);

		},

		processEvents: function(){
			var e = this.get("currentEvents");
			var i = undefined;
			for(i in e){
				Y.bind(e[i].think,e[i])();
			}
			var block = false;
			for(i in e){
				block = block|Y.bind(e[i].isBlocking,e[i])();
			}

			var remove = true;
			while(remove){
				remove = false;
				for(i in e){
					if(Y.bind(e[i].hasFinished,e[i])()){
						e.splice(i,1);
						remove = true;
						break;
					}
				}
			}

			if(!block){
				this.fire("requestEvent");
			}
		},

		registerEvent: function(name,evt){
			var g = this.get("registeredEvents");
			if(g == undefined){
				g = {};
			}
			g[name] = evt;
			this.set("registeredEvents",g);
		},

		stackScript: function(script){
			this.fire("stackScript",{script: script});
		},
		gotoScript: function(script){
			this.fire("gotoScript",{script: script});
		},
		scriptLoaded: function(evt){
			this.fire("scriptLoaded",evt);
		}
	});

	Y.namespace("VN").EventList = EventList;

},"0.0.1",{requires:["base"]});


