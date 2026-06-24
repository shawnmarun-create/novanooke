/* Map product slugs to high-res box/bottle photos from the uploaded kit. */
(function(){
  var Z = 'assets/zip/';
  var M = {
    // [main (box if available), alt (bottle only)]
    'amouage-guidance-46':                 ['AMOUAGE.jpeg','AMOUAGEBOX.jpeg'],
    'dior-fahrenheit-edt':                 ['FAHRENHEITDIORBOX.jpeg','FAHRENHEIT.jpeg'],
    'dior-jadore-edp':                     ['JADORE.jpeg','JADOREDIORBOX.jpeg'],
    'kayali-vanilla-28-edp':               ['IMG_5369.jpeg','KAYALI.jpeg'],
    'la-vie-est-belle-iris-absolu-leau':   ['la-vie-est-belle-iris-absolu-leau.jpeg','LAVIEESTBELLE.jpeg'],
    'passage-denfer-extreme':              ['passage-denfer-extreme.jpeg','PASSAGEDENFEREXTREME.jpeg'],
    'dipyque-philosykos-edt':              ['PHILOSYKOS.jpeg','IMG_5256.jpeg'],
    'musc-ravageur':                       ['musc-ravageur.jpeg','MUSC.jpeg'],
    'coco-mademoiselle-edp-intense':       ['coco-mademoiselle-edp-intense.jpeg','IMG_4701.jpeg'],
    'bvlgari-jasmine-noir-edp':            ['IMG_4696.jpeg','IMG_4696.jpeg'],
    'the-one-for-men-edt':                 ['IMG_4772.jpeg','IMG_4772.jpeg'],
    'paco-rabbane-lady-million-edp':       ['paco-rabbane-lady-million-edp.jpeg','LADYMILLION.jpeg'],
    'dolce-gabanna-devotion-edp-intense':  ['dolce-gabanna-devotion-edp-intense.jpeg','DOLCE_GABANA.jpeg'],
    'billie-eilish':                       ['billie-eilish.jpeg','EILISH.jpeg'],
    'hermes-terre-dhermes-edp-intense-copy':['hermes-terre-dhermes-edp-intense-copy.jpeg','TERREDHERMES.jpeg'],
    'miss-dior-edp':                       ['miss-dior-edp.jpeg','MISSDIOR.jpeg'],
    '212-sexy-men-edt':                    ['212-sexy-men-edt.jpeg','212SEXYMAN.jpeg'],
    '212-men-nyc-edt':                     ['212-men-nyc-edt.jpeg','212MENNYC.jpeg'],
    'bvlgari-le-gemme-ambero':             ['bvlgari-le-gemme-ambero.jpeg','bvlgari-le-gemme-ambero.jpeg'],
    'chanel-chance-tundre-edp':            ['chanel-chance-tundre-edp.jpeg','CHANCECHANEL.jpeg'],
    'si-passione':                         ['si-passione.jpeg','SIRED.jpeg'],
    'giorgio-armani-si':                   ['giorgio-armani-si.jpeg','SICHAMPAGNE.jpeg'],
    'acqua-di-gio-profumo-parfum':         ['acqua-di-gio-profumo-parfum.jpeg','ACQUADIGIO.jpeg'],
    'good-girl-edp':                       ['good-girl-edp.jpeg','GOODGIRL.jpeg'],
    'gucci-bloom-intense':                 ['GUCCIBLOOM.jpeg','GUCCIBLOOM.jpeg'],
    'gucci-guilty-pour-homme-parfum':      ['gucci-guilty-pour-homme-parfum.jpeg','GUCCIGUILTY.jpeg'],
    'gucci-flora-gorgeous-gardenia':       ['gucci-flora-gorgeous-gardenia.jpeg','GUCCIFLORA.jpeg'],
    'gucci-flora-gorgeous-jasmine':        ['gucci-flora-gorgeous-jasmine.jpeg','GUCCIFLORAGREEN.jpeg'],
    'lady-vengeance':                      ['lady-vengeance.jpeg','JULIETTE.jpeg'],
    '1-million-parfum':                    ['1-million-parfum.jpeg','1MILLION.jpeg'],
    'prada-paradoxe-intense':              ['prada-paradoxe-intense.jpeg','PRADAPARADOX.jpeg'],
    'tomford-black-orchid-edt':            ['tomford-black-orchid-edt.jpeg','TOMFORD.jpeg'],
    'tomford-black-orchid-edp':            ['tomford-black-orchid-edp.jpeg','TOMFORD.jpeg'],
    'valentino-extradose-parfum':          ['valentino-extradose-parfum.jpeg','VALENTINO.jpeg'],
    'versarce-dylan-blue-edt':             ['versarce-dylan-blue-edt.jpeg','DYLANBLUE.jpeg'],
    'versarce-eros-parfum':                ['versarce-eros-parfum.jpeg','VERSACEEROS.jpeg'],
    'ysl-libre-edp':                       ['ysl-libre-edp.jpeg','YSLLIBRE.jpeg'],
    'ysl-libre-edp-intense':               ['ysl-libre-edp-intense.jpeg','YSLLIBRE.jpeg'],
    'ysl-myslf-le-parfum':                 ['ysl-myslf-le-parfum.jpeg','YSLMYSELF.jpeg'],
    'ysl-l-elixir':                        ['ysl-l-elixir.jpeg','YSLSAINTLAURENT.jpeg'],
    'ysl-le-parfum':                       ['ysl-le-parfum.jpeg','YSLSAINTLAURENT.jpeg'],
    'jean-paul-le-male-parfum':            ['jean-paul-le-male-parfum.jpeg','JEANPAUL.jpeg'],
    'mancera-red-tobacco-edp':             ['mancera-red-tobacco-edp.jpeg','MANCERA.jpeg'],
    'chanel-n5-edp':                       ['chanel-n5-edp.jpeg','NO5CHANEL.jpeg'],
    'bvlgari-splendida-magnolia-sensuel-edp':['bvlgari-splendida-magnolia-sensuel-edp.jpeg','SPLENDID.jpeg'],
    'bvlgari-aqua-edt':                    ['bvlgari-aqua-edt.jpeg','AQVA.jpeg'],
    'bvlgari-aqua-marine-edt':             ['bvlgari-aqua-marine-edt.jpeg','AQVA2.jpeg'],
    'burberry-herro-edt':                  ['burberry-herro-edt.jpeg','BURBERRYHERO.jpeg'],
    'burberry-goddess-edp-intense':        ['burberry-goddess-edp-intense.jpeg','BURBERRYGODESS.jpeg'],
    '1978':                                ['1978.jpeg','BLEUDECHANEL.jpeg']
  };
  if (window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
    window.PRODUCTS.forEach(function(p){
      var o = M[p.slug];
      if (o) { p.image = Z + o[0]; p.image2 = Z + o[1]; }
    });
  }
})();