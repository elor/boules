/**
 * A list object, which contains numerically indexed values for use with other
 * MVC classes
 *
 * @return ListModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "core/model", "list/listupdatelistener", "core/type"], function (
  extend, Model, ListUpdateListener, Type) {

  /**
   * Constructor for an empty list
   *
   * @param array
   *          Optional. An array of elements which to fill the list with
   */
  function ListModel(array) {
    ListModel.superconstructor.call(this);
    this.length = 0;
    this.list = [];

    ListUpdateListener.bind(this, this.updateLength);

    if (Type.isArray(array)) {
      array.forEach(function (elem) {
        this.push(elem);
      }, this);
    }
  }
  extend(ListModel, Model);
  ListModel.prototype.EVENTS = {
    "reset": true,
    "insert": true,
    "remove": true,
    "resize": true
  };

  /**
   * push() function, which appends an object to the end of the list
   *
   * @param object
   *          an object which will be appended to the list
   * @return the new length of the array. undefined on failure
   */
  ListModel.prototype.push = function (object) {
    var retval;

    retval = this.list.push(object);

    this.emit("insert", {
      id: this.list.length - 1,
      object: object
    });

    return retval;
  };

  /**
   * remove the last element of the array and returns it
   *
   * @return the previously last element of the array, which has been removed
   *         during this function call
   */
  ListModel.prototype.pop = function () {
    var object;

    object = this.list.pop();

    this.emit("remove", {
      id: this.list.length,
      object: object
    });

    return object;
  };

  /**
   * insert an object at the specified index
   *
   * @param index
   *          the index at which to insert the object
   * @param object
   *          the object, which will take the specified index after insertion
   * @return undefined on failure, the inserted object
   */
  ListModel.prototype.insert = function (index, object) {
    if (index >= 0 && index <= this.list.length) {
      this.list.splice(index, 0, object);

      this.emit("insert", {
        id: index,
        object: object
      });

      return object;
    }
    return undefined;
  };

  /**
   * removes the object at the specified index from the list
   *
   * @param index
   *          the index from which to remove from the list
   * @return the removed object
   */
  ListModel.prototype.remove = function (index) {
    var object;

    if (index >= 0 && index < this.list.length) {
      object = this.list.splice(index, 1)[0];

      this.emit("remove", {
        id: index,
        object: object
      });

      return object;
    }

    return undefined;
  };

  /**
   * removes everything in the array.
   */
  ListModel.prototype.clear = function () {
    while (this.length) {
      this.pop();
    }
    this.emit("reset");
  };

  /**
   * finds the index of an object, if available.
   *
   * @param object
   *          the object to look for
   * @return the index of the object in the array, or -1 otherwise
   */
  ListModel.prototype.indexOf = function (object) {
    return this.list.indexOf(object);
  };

  /**
   * Return true if the object is in the list, false otherwise
   *
   * @param object
   *          the object to look for
   * @return true if the object is in the list, false otherwise
   */
  ListModel.prototype.includes = function (object) {
    return this.list.indexOf(object) !== -1;
  };

  /**
   * access the element at the specified index
   *
   * @param index
   *          the index within the list
   * @return the object at the specified index
   */
  ListModel.prototype.get = function (index) {
    return this.list[index];
  };

  /**
   * overwrites (i.e. removes and inserts) an object at the specified index
   *
   * @param index
   *          the index within the list
   * @param object
   *          the object with which to overwrite the index
   * @return the inserted object, or undefined on failure
   */
  ListModel.prototype.set = function (index, object) {
    if (index >= 0 && index < this.list.length) {
      this.remove(index);
      this.insert(index, object);
      return object;
    }

    return undefined;
  };

  /**
   * erase every instance of an object from the list
   *
   * @param object
   *          the object to erase from the list
   * @return the number of removed objects. 0 if none found, undefined on
   *         failure
   */
  ListModel.prototype.erase = function (object) {
    var num, index;
    num = 0;

    while ((index = this.indexOf(object)) >= 0) {
      if (this.remove(index) === object) {
        num += 1;
      }
    }

    return num;
  };

  /**
   * for each element in the list, run the specified function. The return values
   * of the function are accumulated and returned as an array
   *
   * @param callback
   *          function(object, index, list)
   * @param thisArg
   *          Optional. Value to use as this when executing callback
   * @return an array of the functions return values
   */
  ListModel.prototype.map = function (callback, thisArg) {
    var index, ret;

    thisArg = thisArg || undefined;
    ret = [];

    for (index = 0; index < this.length; index += 1) {
      ret.push(callback.call(thisArg, this.get(index), index, this));
    }

    return ret;
  };

  ListModel.prototype.forEach = ListModel.prototype.map;

  /**
   * returns the contents of the list as an array
   *
   * @return the contents of the list as an array
   */
  ListModel.prototype.asArray = function () {
    return this.list.slice(0);
  };

  /**
   * update the length variable of the list. Used internally.
   */
  ListModel.prototype.updateLength = function () {
    if (this.length !== this.list.length) {
      this.length = this.list.length;
      this.emit("resize");
    }
  };

  /**
   * makes this instance of ListModel readonly
   */
  ListModel.prototype.makeReadonly = function () {
    this.push = undefined;
    this.pop = undefined;
    this.insert = undefined;
    this.remove = undefined;
    this.clear = undefined;
    this.erase = undefined;
  };

  /**
   * save the current state to a data object for serialization. The data object
   * is supposed to be compact, i.e. a native list
   *
   * @return a list that can be used to restore the current list state
   */
  ListModel.prototype.save = function () {
    var data;
    /*
     * Note to self: ListModel ignores the default data object format in favor
     * of a list representation. Types aren't checked, so in the worst case,
     * restore() will fail dramatically
     */

    if (this.list.every(function (element) {
        return Type.isFunction(element.save);
      })) {
      // everything is serializable
      data = this.list.map(function (element) {
        try {
          return element.save();
        } catch (e) {
          console.error("ListModel.save() failed with error: ");
          console.error(e.stack);
          throw new Error("ListModel.save() failed");
        }
      });
    } else {
      // just return the objects themselves, since they're not serializable.
      // I don't see an elegant way to enable structs and atomic types to use
      // this feature.
      data = this.asArray();
    }

    return data;
  };

  /**
   * restore the list state from a previously saved data object (see save())
   *
   * @param data
   * @param ElementModel
   *          a constructor for the element, which has to be a subclass of
   *          Model, or a factory function, which takes the restore data and
   *          returns a new SomethingModel() instance, but doesn't call
   *          restore() itself.
   * @return true on success, false otherwise
   */
  ListModel.prototype.restore = function (data, ElementModel) {
    if (!data || !Type.isArray(data)) {
      return false;
    }

    this.clear();

    if (Type.isFunction(ElementModel)) {
      // path for constructor/Model types
      return data.every(function (element, index) {
        var instance;
        try {
          if (extend.isSubclass(ElementModel, Model)) {
            instance = new ElementModel();
          } else {
            instance = ElementModel(element);
          }
          if (!instance.restore(element)) {
            return false;
          }
          while (this.length < index) {
            this.push(undefined);
          }
          this.push(instance);
          return true;
        } catch (e) {
          console.error("ListModel.restore() failed for an element:");
          console.error(element);
          console.error(e.stack);
          return false;
        }
      }, this);
    }

    // path for raw types
    data.forEach(function (element, index) {
      while (this.length < index) {
        this.push(undefined);
      }
      this.push(element);
    }, this);
    return true;
  };

  ListModel.prototype.SAVEFORMAT = [ /* anything */ ];

  return ListModel;
});