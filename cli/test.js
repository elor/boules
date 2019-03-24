﻿#!/usr/bin/env node

'use strict'

var requirejs = require('requirejs')
var QUnit = require('qunitjs')

var tests = ['core/test/byeresult',
  'core/test/byeresult',
  'core/test/correctionmodel',
  'core/test/correctionreferencemodel',
  'core/test/emitter',
  'core/test/listener',
  'core/test/matchmodel',
  'core/test/matchreferencemodel',
  'core/test/matchresult',
  'core/test/model',
  'core/test/propertymodel',
  'core/test/propertyvaluemodel',
  'core/test/random',
  'core/test/resultreferencemodel',
  'core/test/rle',
  'core/test/selectionvaluemodel',
  'core/test/statevaluemodel',
  'core/test/type',
  'core/test/valuemodel',
  'list/test/binningreferencelistmodel',
  'list/test/combinedreferencelistmodel',
  'list/test/indexedlistmodel',
  'list/test/indexedmodel',
  'list/test/lengthmodel',
  'list/test/listmodel',
  'list/test/listupdatelistener',
  'list/test/maplistmodel',
  'list/test/orderlistmodel',
  'list/test/readonlylistmodel',
  'list/test/referencelistmodel',
  'list/test/sortedreferencelistmodel',
  'list/test/uniquelistmodel',
  'math/test/absolutematrix',
  'math/test/antisymmetricmatrixmodel',
  'math/test/delegatematrix',
  'math/test/matrixmodel',
  'math/test/positivematrix',
  'math/test/symmetricmatrixmodel',
  'math/test/transposedifferencematrix',
  'math/test/transposesummatrix',
  'math/test/trianglematrixmodel',
  'math/test/vectormodel',
  'ranking/test/rankingcomponentindex',
  'ranking/test/rankingdatalistenerindex',
  'ranking/test/rankingheadtohead',
  'ranking/test/rankingmapper',
  'ranking/test/rankingmodel',
  'ranking/test/rankingpoules',
  'ranking/test/rankingsonneborn',
  'ranking/test/rankingtac',
  'ranking/test/rankingthreepoint',
  'ranking/test/rankingtwopoint',
  'timemachine/test/keymodel',
  'timemachine/test/query',
  'tournament/test/kotournamentmodel',
  'tournament/test/roundtournamentmodel',
  'tournament/test/swisstournamentmodel',
  'tournament/test/tournamentindex',
  'tournament/test/tournamentlistmodel',
  'tournament/test/tournamentmodel',
  // 'ui/test/binarytreemodel',
  // 'ui/test/listcollectormodel',
  'ui/test/playermodel',
  'ui/test/teammodel'
  // 'ui/test/teamsfileloadcontroller'
]

process.chdir(__dirname)

requirejs.config({
  baseUrl: '../scripts'
})

requirejs(['core/config'], function (config) {
  var myBase = '../test/scripts/'

  requirejs.config({
    paths: {
      'options': myBase + 'options',
      'presets': myBase + 'presets',
      'strings': myBase + 'strings'
    }
  })

  QUnit.testStart(function (test) {
  })

  QUnit.log(function (test) {
    if (!test.result) {
      console.log(test.message)
      console.log({ actual: test.actual, expected: test.expected })
      console.log(test.source)
    }
  })

  QUnit.testDone(function (test) {
  })

  QUnit.done(function (data) {
    console.log(JSON.stringify(data, null, '  '))

    if (data.failed) {
      process.exit(1)
    }
  })

  tests.forEach(test => requirejs(test)(QUnit, requirejs))

  QUnit.load()
})
