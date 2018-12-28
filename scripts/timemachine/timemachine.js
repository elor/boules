/**
 * TimeMachineModel
 *
 * TODO TEST!
 *
 * @return TimeMachineModelModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'timemachine/reflog',
  'timemachine/keymodel', 'timemachine/commitmodel', 'list/listmodel',
  'timemachine/query', 'list/sortedreferencelistmodel',
  'ui/listcollectormodel', 'presets', 'core/valuemodel'], function (extend,
  Model, RefLog, KeyModel, CommitModel, ListModel, Query,
  SortedReferenceListModel, ListCollectorModel, Presets, ValueModel) {
  var TimeMachine

  /**
   * Constructor
   */
  function TimeMachineModel () {
    var latestKey
    TimeMachineModel.superconstructor.call(this)

    latestKey = RefLog.getLatestGlobalKey()

    /*
     * unsortedRoots: base list
     */
    this.unsortedRoots = new ListModel()

    /*
     * roots: reference list. Use this one :-)
     */
    this.roots = new SortedReferenceListModel(this.unsortedRoots,
      CommitModel.sortFunction)

    this.rootsCollector = new ListCollectorModel(this.unsortedRoots,
      CommitModel)
    this.rootsCollector.registerListener(this)

    RefLog.registerListener(this)

    this.updateRoots()

    /*
     * commit is the current commit.
     */
    this.commit = new ValueModel(undefined)
    if (latestKey) {
      this.commit.set(new CommitModel(latestKey))
    } else {
      console.warn('No saved tournament found.')
    }
  }
  extend(TimeMachineModel, Model)

  TimeMachineModel.prototype.EVENTS = {
    'init': true,
    'save': true,
    'cleanup': true,
    'load': true,
    'unload': true
  }

  /**
   * re-read the roots from the reflog and update this.unsortedRoots, which
   * reflects on this.roots
   */
  TimeMachineModel.prototype.updateRoots = function () {
    var rootCommits, rootKeyStrings, index, keyString

    rootCommits = RefLog.getInitKeys().map(function (key) {
      return new CommitModel(key)
    })
    rootKeyStrings = rootCommits.map(function (commit) {
      return commit.key.toString()
    })

    /*
     * remove old commits
     */
    for (index = this.unsortedRoots.length - 1; index >= 0; index -= 1) {
      keyString = this.unsortedRoots.get(index).key.toString()
      if (rootKeyStrings.indexOf(keyString) === -1) {
        this.unsortedRoots.get(index).destroy()
        this.unsortedRoots.remove(index)
      }
    }

    /*
     * add new commits
     */
    rootKeyStrings = this.unsortedRoots.map(function (commit) {
      return commit.key.toString()
    })
    rootCommits.forEach(function (commit) {
      keyString = commit.key.toString()
      if (rootKeyStrings.indexOf(keyString) === -1) {
        this.unsortedRoots.push(commit)
      }
    }, this)
  }

  /**
   * store the given state under a fresh commit as the root of a new tree
   *
   * @param state
   *          the string to save
   * @return the associated root commit
   */
  TimeMachineModel.prototype.init = function (state, name) {
    this.commit.set(CommitModel.createRoot(state, name || Presets.target))

    this.emit('init', this.commit.get())

    this.updateRoots()

    return this.commit.get()
  }

  /**
   * stores the given state under a new commit, which is a descendant of the
   * active commit
   *
   * @param state
   *          the string to save
   * @param parentKey
   *          the key of any parent in the same tree
   *
   * @return the generated key
   */
  TimeMachineModel.prototype.save = function (state) {
    if (this.commit.get() && this.commit.get().isValid()) {
      if (state === this.commit.get().load()) {
        return this.commit.get() // no change in data. Nothing to save here.
      }
      this.commit.set(this.commit.get().createChild(state))
    } else {
      this.commit.set(undefined)
      return undefined
    }

    this.emit('save', this.commit.get())

    return this.commit.get()
  }

  /**
   * load another commit from localStorage
   *
   * @param commit
   *          a CommitModel instance to load
   * @return undefined on load error, the localStorage content otherwise
   *         (serialized save state)
   */
  TimeMachineModel.prototype.load = function (commit) {
    var data

    if (commit === undefined && this.isInitialized()) {
      return this.commit.get().load()
    }

    this.unload()

    if (!(commit instanceof CommitModel) || !commit.isValid()) {
      return undefined
    }

    data = commit.load()
    if (data) {
      this.commit.set(commit)
      this.emit('load', data)
    }
    return data
  }

  /**
   * resets the currently active commit.
   */
  TimeMachineModel.prototype.unload = function () {
    this.commit.set(undefined)
    this.emit('unload')
  }

  TimeMachineModel.prototype.getOrphans = function () {
    var query, orphanedCommits

    /*
     * check all localStorage keys
     */
    query = new Query(Query.ALLKEYS)
    orphanedCommits = query.filter().map(function (keyString) {
      return new CommitModel(keyString)
    }).filter(function (commit) {
      return !commit.isValid()
    })

    /*
     * check all reflog entries
     */
    orphanedCommits = orphanedCommits.concat(RefLog.getAllKeys().map(
      function (key) {
        return new CommitModel(key)
      }).filter(function (commit) {
      return !commit.isValid()
    }))

    return orphanedCommits.sort(CommitModel.sortFunction)
  }

  TimeMachineModel.prototype.isInitialized = function () {
    return !!this.commit.get()
  }

  TimeMachineModel.prototype.isActive = function (commit) {
    return !!this.commit.get() && !!commit &&
        this.commit.get().key.isEqual(commit.key)
  }

  TimeMachineModel.prototype.isRelatedToActive = function (commit) {
    return !!this.commit.get() && !!commit &&
        this.commit.get().key.isRelated(commit.key)
  }

  /**
   * get the used amount of localStorage, in unicode symbols, which is used by
   * the tree associated with the commit
   *
   * @param commit
   *          any commit of the tree to investigate
   * @return the size in the localStorage, in unicode symbols.
   */
  TimeMachineModel.prototype.usedRelatedStorage = function (commit) {
    var total, query

    total = 0
    query = new Query(commit.key)

    query.filter().forEach(function (key) {
      var data
      if (window.localStorage) {
        data = window.localStorage[key] || ''
      } else {
        data = ''
      }
      total += data.length
    })

    return total
  }

  /**
   * Calculate the size of each target in the localStorage.
   *
   * @return an object, where object[target] == size for each of the currently
   *         stored targets, and where object.total is the total of all targets
   */
  TimeMachineModel.prototype.usedStorage = function () {
    var tuveroQuery, targetSizes, total

    targetSizes = {}

    tuveroQuery = new Query(Query.ALLTUVEROKEYS)
    tuveroQuery.filter().forEach(function (key) {
      var target, data

      target = key.split('_')[0]
      if (window.localStorage) {
        data = window.localStorage[key] || ''
      } else {
        data = ''
      }

      targetSizes[target] = (targetSizes[target] || 0) + data.length
    })

    total = 0
    if (window.localStorage) {
      Object.keys(targetSizes).forEach(
        function (target) {
          targetSizes[target] += (window.localStorage[RefLog.formatTargetKey(target)] || '').length
          total += targetSizes[target]
        })
    }
    targetSizes.total = total

    return targetSizes
  }

  /**
   * Removes all keys until keepNum keys are left, excluding the root and the
   * latest key, starting with the oldest key.
   *
   * Example: If you want to keep the root, latest and the key before the latest
   * key
   *
   * @param relatedCommit
   *          any commit within the tree. Required!
   * @param keepNum
   *          the number of commits to keep, excluding root and latest
   */
  TimeMachineModel.prototype.cleanup = function (relatedCommit, keepNum) {
    var query, relatedKeys

    if (!(relatedCommit instanceof CommitModel) || !relatedCommit.isValid()) {
      return
    }

    query = new Query(relatedCommit.key)
    relatedKeys = query.filter()

    relatedKeys.shift() // don't delete the root key
    relatedKeys.pop() // don't delete the latest key

    while (relatedKeys.length > keepNum) {
      (new CommitModel(relatedKeys.shift())).remove()
    }

    this.emit('cleanup', relatedCommit)
  }

  /**
   * update this.roots whenever a root is deleted (which is performed via a
   * function of the CommitModel API)
   *
   * @param event ==
   *          'remove'
   * @param emitter ==
   *          this.rootsCollector
   * @param data
   *          {source: removed_commit}
   */
  TimeMachineModel.prototype.onremove = function (event, emitter, data) {
    if (data.source.isRoot()) {
      var index = this.unsortedRoots.indexOf(data.source)
      this.unsortedRoots.get(index).destroy()
      this.unsortedRoots.remove(index)
    }
  }

  TimeMachineModel.prototype.onrefresh = function (event, emitter, data) {
    this.updateRoots()
  }

  TimeMachine = new TimeMachineModel()
  return TimeMachine
})
