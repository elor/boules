/**
 * FileLoadController
 *
 * @return FileLoadController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller', 'ui/inputview', 'ui/toast',
  'ui/strings'], function ($, extend, Controller, InputView, Toast, Strings) {
  /**
   * Constructor. Attention: It doesn't take a View, but a jquery element!
   *
   * @param $button
   *          a button element which, when clicked or drag-dropped, triggers the
   *          file selection/open
   */
  function FileLoadController ($button) {
    var controller, view

    view = new InputView($('<input>').attr('type', 'file'))
    FileLoadController.superconstructor.call(this, view)

    controller = this
    this.reader = undefined
    this.file = undefined

    this.view.$view.change(function (evt) {
      controller.initFileRead(evt.target.files[0])
    })

    $button.on('dragover', this.buttonDragOver.bind(this))
    $button.on('drop', this.buttonDrop.bind(this))
    $button.click(function () {
      controller.view.$view.click()
    })
  }
  extend(FileLoadController, Controller)

  /*
   * Functions to implement
   */

  /**
   * unread a file, e.g. on file read error. Please overload.
   */
  FileLoadController.prototype.unreadFile = function () {
    console.warn('FileLoadController.unreadfile() called but not overloaded')
  }

  /**
   * Read a file into your model or whatever. Please overload.
   *
   * @param fileContents
   *          the contents of the loaded file
   */
  FileLoadController.prototype.readFile = function (fileContents) {
    console.log(fileContents)
  }

  /*
   * Protected functions. Do not implement.
   */

  /**
   * Drag&Drop event handling: set drag&drop behavior
   *
   * @param evt
   *          the dragover event
   * @return false
   */
  FileLoadController.prototype.buttonDragOver = function (evt) {
    evt.originalEvent.dataTransfer.dropEffect = 'copy'
  }

  /**
   * Handle Drag-Drop events: if there is exactly one file carried, open it.
   * Show error-toasts otherwise.
   *
   * @param evt
   * @return false
   */
  FileLoadController.prototype.buttonDrop = function (evt) {
    var files = evt.originalEvent.dataTransfer.files

    if (files.length < 1) {
      Toast.once(Strings.nofiles, Toast.LONG)
      return
    } else if (files.length > 1) {
      Toast.once(Strings.onlyonefile, Toast.LONG)
      return
    }

    if (files[0]) {
      this.initFileRead(files[0])
    } else {
      Toast.once(Strings.nofiles, Toast.LONG)
    }
  }

  /**
   * initiate file read after its selection. Applies to drag&drop and click.
   *
   * @param file
   */
  FileLoadController.prototype.initFileRead = function (file) {
    this.file = file
    this.reader = new window.FileReader()

    this.reader.onerror = this.loadError.bind(this)
    this.reader.onabort = this.loadAbort.bind(this)
    this.reader.onload = this.loadSuccess.bind(this)

    this.reader.readAsText(this.file)
  }

  /**
   * FileReader callback function for load error. Calls `this.unreadFile()` and
   * shows the cause of the error as a toast
   *
   * @param evt
   */
  FileLoadController.prototype.loadError = function (evt) {
    this.unreadFile()

    switch (evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        Toast.once(Strings.filenotfound)
        break
      case evt.target.error.NOT_READABLE_ERR:
        Toast.once(Strings.filenotreadable)
        break
      case evt.target.error.ABORT_ERR:
        break
      default:
        Toast.once(Strings.fileerror, Toast.LONG)
    }

    this.model.emit('reset')
  }

  /**
   * FileReader callback function: load success. Calls this.readFile()
   *
   * @param evt
   */
  FileLoadController.prototype.loadSuccess = function (evt) {
    if (evt.target === this.reader) {
      this.readFile(evt.target.result)
    } else {
      Toast.once(Strings.loadfailed, Toast.LONG)
    }

    this.model.emit('reset')
  }

  /**
   * FileReader callback function: loading was aborted (e.g. during file
   * selection)
   */
  FileLoadController.prototype.loadAbort = function () {
    Toast.once(Strings.fileabort)
  }

  return FileLoadController
})
