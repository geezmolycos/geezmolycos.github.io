from browser import window

from javascript import RegExp, String

R1 = RegExp.new(r"[A-Za-z]+", "g")

from tokipona_chinese import TokiPonaReplacer


def replace_words(self, text):
    text = String.new(text)
    return text.replace(R1, lambda match, *args: self.word_replacer(match))
TokiPonaReplacer.replace_words = replace_words # monkey patch for optimization

def toki_pona_replace(text, dicts, configs):
    w, pu, ph = dicts
    configs = configs.to_dict()
    w = w.to_dict() if configs["enable_word_dict"] else {}
    pu = pu.to_dict() if configs["enable_punct_dict"] else {}
    ph = set(ph.to_dict()) if configs["enable_phonetic_dict"] else {}
    front_replacer = TokiPonaReplacer(w, pu, ph, **configs)
    replaced_text = front_replacer.replace_all(text)
    if configs["use_wi_we_kana"]:
        replaced_text = replaced_text.replace("ウィ","ヰ").replace("うぃ","ゐ")
        replaced_text = replaced_text.replace("ウェ","ヱ").replace("うぇ","ゑ")
    if configs["use_je_kana"]:
        replaced_text = replaced_text.replace("イェ","\U0001B121").replace("いぇ", "\U0001B001")
    return replaced_text
window.toki_pona_replace_init(toki_pona_replace)
