console.log("test");
var a = vv("1");
var b = vv("2");
var c = vv("3");
console.log(a.value() + " / " + b.value() + " / " + c.value());
a.bind(b.plus(c));
console.log(a.value() + " / " + b.value() + " / " + c.value());

console.log("end");
function vv(value) {
    return new VolatileVariable(value);
}
function VolatileVariable(value) {
    var me = this;
    me._value = value;
    me._binded = new Array();
    me._lockChange = false;
    me._ = false;
    me._afterChange = function() {
        //
    };
    me.set = function(value) {
        if (!me._lockChange) {
            if (me._value === value) {
                //skip
            } else {
                me._lockChange = true;
                me._value = value;
                for (var i = 0; i < me._binded.length; i++) {
                    me._binded[i].set(value);
                }
                me._afterChange();
                me._lockChange = false;
            }
        }
    };
    me.value = function() {
        return me._value
    };
    me.afterChange = function(action) {
        me._afterChange = action;
        return me;
    };
    me.bind = function(to) {
        if (!me._binded.indexOf(to) > -1) {
            me._binded.push(to);
        }
        if (!to._binded.indexOf(to) > -1) {
            to._binded.push(me);
        }
        me.set(to.value());
        return me;
    };
    me.unbind = function(from) {
        var n = me._binded.indexOf(from);
        if (n > -1) {
            me._binded.splice(n, 1);
        }
        n = from._binded.indexOf(me);
        if (n > -1) {
            from._binded.splice(n, 1);
        }
    };
    me.watch = function(to) {
        var n = me._binded.indexOf(to);
        if (n > -1) {
            me._binded.splice(n, 1);
        }
        if (!to._binded.indexOf(to) > -1) {
            to._binded.push(me);
        }
        me.set(to.value());
        return me;
    };
    me.same = function(it) {
        var result = new VolatileVariable();
        var trigger = function() {
            result.set(me.value() == it.value());
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        trigger();
        return result;
    };
    me.or = function(it) {
        var result = new VolatileVariable();
        var trigger = function() {
            result.set(me.value() || it.value());
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        trigger();
        return result;
    };
    me.and = function(it) {
        var result = new VolatileVariable();
        var trigger = function() {
            result.set(me.value() && it.value());
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        trigger();
        return result;
    };
    me.minus = function(it) {
        var result = new VolatileVariable();
        var trigger = function() {
            result.set(me.value() - it.value());
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        trigger();
        return result;
    };
    me.plus = function(it) {
        var result = new VolatileVariable();
        var trigger = function() {
            result.set(me.value() + it.value());
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        trigger();
        return result;
    };
    me.multiply = function(it) {
        var result = new VolatileVariable();
        var trigger = function() {
            result.set(me.value() * it.value());
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        trigger();
        return result;
    };
    me.divide = function(it) {
        var result = new VolatileVariable();
        var trigger = function() {
            result.set(me.value() / it.value());
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        trigger();
        return result;
    };
    me.toggle = function(it, otherwise) {
        var result = new VolatileVariable();
        var trigger = function() {
            if (me.value()) {
                result.set(it.value());
            } else {
                result.set(otherwise.value());
            }
        };
        new VolatileVariable().watch(it).afterChange(trigger);
        new VolatileVariable().watch(me).afterChange(trigger);
        new VolatileVariable().watch(otherwise).afterChange(trigger);
        trigger();
        return result;
    };
    return me;
}

