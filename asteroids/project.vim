let SessionLoad = 1
if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
inoremap <silent> <C-Tab> =UltiSnips_ListSnippets()
inoremap <silent> <S-Tab> =UltiSnips_JumpBackwards()
imap <F1> 
xnoremap 	 :call UltiSnips_SaveLastVisualSelection()gvs
snoremap <silent> 	 :call UltiSnips_ExpandSnippetOrJump()
xnoremap <NL> :m'>+`<my`>mzgv`yo`z
nnoremap <NL> mz:m+`z
vnoremap  :m'<-2`>my`<mzgv`yo`z
nnoremap  mz:m-2`z
nnoremap <silent>  :CtrlP
vnoremap <silent> 9 :TCommentMaybeInline count=9
nnoremap <silent> 9 :TComment count=9
onoremap <silent> 9 :TComment count=9
vnoremap <silent> 8 :TCommentMaybeInline count=8
nnoremap <silent> 8 :TComment count=8
onoremap <silent> 8 :TComment count=8
vnoremap <silent> 7 :TCommentMaybeInline count=7
nnoremap <silent> 7 :TComment count=7
onoremap <silent> 7 :TComment count=7
vnoremap <silent> 6 :TCommentMaybeInline count=6
nnoremap <silent> 6 :TComment count=6
onoremap <silent> 6 :TComment count=6
vnoremap <silent> 5 :TCommentMaybeInline count=5
nnoremap <silent> 5 :TComment count=5
onoremap <silent> 5 :TComment count=5
vnoremap <silent> 4 :TCommentMaybeInline count=4
nnoremap <silent> 4 :TComment count=4
onoremap <silent> 4 :TComment count=4
vnoremap <silent> 3 :TCommentMaybeInline count=3
nnoremap <silent> 3 :TComment count=3
onoremap <silent> 3 :TComment count=3
vnoremap <silent> 2 :TCommentMaybeInline count=2
nnoremap <silent> 2 :TComment count=2
onoremap <silent> 2 :TComment count=2
vnoremap <silent> 1 :TCommentMaybeInline count=1
nnoremap <silent> 1 :TComment count=1
onoremap <silent> 1 :TComment count=1
noremap ca :call tcomment#SetOption("as", input("Comment as: ", &filetype, "customlist,tcomment#Complete"))
noremap <silent> cc :call tcomment#SetOption("count", v:count1)
noremap s :TCommentAs =&ft_
noremap n :TCommentAs =&ft 
noremap a :TCommentAs 
noremap b :TCommentBlock
vnoremap <silent> i :TCommentInline
noremap <silent> r :TCommentRight
noremap   :TComment 
noremap <silent> p m`vip:TComment``
vnoremap <silent>  :TCommentMaybeInline
nnoremap <silent>  :TComment
onoremap <silent>  :TComment
vnoremap  s "zy :call qsearch#Search("visual",@z)
nnoremap  s "zyiw :call qsearch#Search("normal",@z)
noremap  _s :TCommentAs =&ft_
noremap  _n :TCommentAs =&ft 
noremap  _a :TCommentAs 
noremap  _b :TCommentBlock
noremap <silent>  _r :TCommentRight
xnoremap <silent>  _i :TCommentInline
noremap  _  :TComment 
noremap <silent>  _p vip:TComment
xnoremap <silent>  __ :TCommentMaybeInline
nnoremap <silent>  __ :TComment
snoremap <silent>  __ :TComment
onoremap <silent>  __ :TComment
vnoremap <silent>   w :call EasyMotion#WB(1, 0)
onoremap <silent>   w :call EasyMotion#WB(0, 0)
nnoremap <silent>   w :call EasyMotion#WB(0, 0)
vnoremap <silent>   t :call EasyMotion#T(1, 0)
onoremap <silent>   t :call EasyMotion#T(0, 0)
nnoremap <silent>   t :call EasyMotion#T(0, 0)
vnoremap <silent>   n :call EasyMotion#Search(1, 0)
onoremap <silent>   n :call EasyMotion#Search(0, 0)
vnoremap <silent>   k :call EasyMotion#JK(1, 1)
onoremap <silent>   k :call EasyMotion#JK(0, 1)
nnoremap <silent>   k :call EasyMotion#JK(0, 1)
vnoremap <silent>   j :call EasyMotion#JK(1, 0)
onoremap <silent>   j :call EasyMotion#JK(0, 0)
nnoremap <silent>   j :call EasyMotion#JK(0, 0)
vnoremap <silent>   gE :call EasyMotion#EW(1, 1)
onoremap <silent>   gE :call EasyMotion#EW(0, 1)
nnoremap <silent>   gE :call EasyMotion#EW(0, 1)
vnoremap <silent>   f :call EasyMotion#F(1, 0)
onoremap <silent>   f :call EasyMotion#F(0, 0)
nnoremap <silent>   f :call EasyMotion#F(0, 0)
vnoremap <silent>   e :call EasyMotion#E(1, 0)
onoremap <silent>   e :call EasyMotion#E(0, 0)
nnoremap <silent>   e :call EasyMotion#E(0, 0)
vnoremap <silent>   b :call EasyMotion#WB(1, 1)
onoremap <silent>   b :call EasyMotion#WB(0, 1)
nnoremap <silent>   b :call EasyMotion#WB(0, 1)
vnoremap <silent>   W :call EasyMotion#WBW(1, 0)
onoremap <silent>   W :call EasyMotion#WBW(0, 0)
nnoremap <silent>   W :call EasyMotion#WBW(0, 0)
vnoremap <silent>   T :call EasyMotion#T(1, 1)
onoremap <silent>   T :call EasyMotion#T(0, 1)
nnoremap <silent>   T :call EasyMotion#T(0, 1)
vnoremap <silent>   N :call EasyMotion#Search(1, 1)
onoremap <silent>   N :call EasyMotion#Search(0, 1)
nnoremap <silent>   N :call EasyMotion#Search(0, 1)
vnoremap <silent>   ge :call EasyMotion#E(1, 1)
onoremap <silent>   ge :call EasyMotion#E(0, 1)
nnoremap <silent>   ge :call EasyMotion#E(0, 1)
vnoremap <silent>   F :call EasyMotion#F(1, 1)
onoremap <silent>   F :call EasyMotion#F(0, 1)
nnoremap <silent>   F :call EasyMotion#F(0, 1)
vnoremap <silent>   E :call EasyMotion#EW(1, 0)
onoremap <silent>   E :call EasyMotion#EW(0, 0)
nnoremap <silent>   E :call EasyMotion#EW(0, 0)
vnoremap <silent>   B :call EasyMotion#WBW(1, 1)
onoremap <silent>   B :call EasyMotion#WBW(0, 1)
nnoremap <silent>   B :call EasyMotion#WBW(0, 1)
nnoremap  2 :execute "silent !tmux send-keys -t bottom 'va.sh -t restart' C-m"|redraw!
nnoremap  1 :execute "silent !tmux send-keys -t bottom 'va.sh -t restart -f' C-m"|redraw!
nnoremap  ; :call ToggleSemiColonComma()
nnoremap  k gt
nnoremap  j gT
vmap  c "sy:%s/=EscapeRegex(@s)//n
vmap  r "sy:%s/=EscapeRegex(@s)/
nnoremap  cd :cd %:p:h :echo expand("%:p:h")
nnoremap   p :lN
nnoremap <silent>   n :call EasyMotion#Search(0, 0)
nnoremap  p :cN
nnoremap  n :cn
nnoremap <silent>   :noh
nnoremap   s :mks! project.vim
nnoremap   l :call LoadProject()
nnoremap  v :so $MYVIMRC
nnoremap  e :tabedit! $MYVIMRC
nnoremap  w :w!
vnoremap < <gv
xnoremap > >gv
nnoremap K <Nop>
nnoremap N Nzz
nnoremap Q <Nop>
xmap S <Plug>VSurround
xmap [% [%m'gv``
xmap ]% ]%m'gv``
xmap a% [%v]%
nmap cs <Plug>Csurround
nmap ds <Plug>Dsurround
nmap gx <Plug>NetrwBrowseX
xnoremap <silent> gC :TCommentMaybeInline!
nnoremap <silent> gCc :let w:tcommentPos = getpos(".") | set opfunc=tcomment#OperatorLineAnywayg@$
nnoremap <silent> gC :let w:tcommentPos = getpos(".") | set opfunc=tcomment#OperatorAnywayg@
xnoremap <silent> gc :TCommentMaybeInline
nnoremap <silent> gcc :let w:tcommentPos = getpos(".") | set opfunc=tcomment#OperatorLineg@$
nnoremap <silent> gc :let w:tcommentPos = getpos(".") | set opfunc=tcomment#Operatorg@
xmap gS <Plug>VgSurround
nnoremap gV `[v`]
nnoremap j gj
nnoremap k gk
nnoremap n nzz
nmap ySS <Plug>YSsurround
nmap ySs <Plug>YSsurround
nmap yss <Plug>Yssurround
nmap yS <Plug>YSurround
nmap ys <Plug>Ysurround
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#NetrwBrowseX(expand("<cWORD>"),0)
snoremap <silent> <BS> c
snoremap <silent> <C-Tab> :call UltiSnips_ListSnippets()
snoremap <silent> <S-Tab> :call UltiSnips_JumpBackwards()
nnoremap <silent> <Plug>SurroundRepeat .
nnoremap <F6> :NERDTreeToggle
nnoremap <F3> :call ToggleRelativeNumbers()
nnoremap <F2> :call ToggleMouse()
map <F1> 
nnoremap <Down> :noh
nnoremap <Up> :noh
nnoremap <Right> :noh
nnoremap <Left> :noh
nnoremap <F8> :call ClearTabsAndCRs()
nnoremap <F7> :set invspell
nnoremap <F5> :set invwrap
nnoremap <F4> :set invlist
imap S <Plug>ISurround
imap s <Plug>Isurround
inoremap <silent> 	 =UltiSnips_ExpandSnippetOrJump()
imap  @@@hhkywjl?@@@P/@@@3s
imap  <Plug>SuperTabForward
imap  <Plug>SuperTabBackward
imap  <Plug>Isurround
imap <silent> [6~ <PageDown>
imap <silent> [5~ <PageUp>
imap <silent> OF <End>
imap <silent> OH <Home>
imap <silent> OD <Left>
imap <silent> OC <Right>
imap <silent> OB <Down>
imap <silent> OA <Up>
inoremap s :TCommentAs =&ft_
inoremap n :TCommentAs =&ft 
inoremap a :TCommentAs 
inoremap b :TCommentBlock
inoremap <silent> r :TCommentRight
inoremap   :TComment 
inoremap <silent> p :norm! m`vip:TComment``
inoremap <silent>  :TComment
iabbr xdate =strftime("%Y-%m-%d")
let &cpo=s:cpo_save
unlet s:cpo_save
set autoindent
set autoread
set backspace=indent,eol,start
set copyindent
set expandtab
set fileencodings=ucs-bom,utf-8,latin1
set fileformats=unix,dos,mac
set helplang=en
set history=1000
set hlsearch
set incsearch
set isident=@,48-57,_,192-255,$
set laststatus=2
set listchars=trail:.,tab:▸\ ,eol:¬
set mouse=a
set omnifunc=javascriptcomplete#CompleteJS
set path=.,./**,,
set printoptions=paper:letter
set ruler
set runtimepath=~/.vim,~/.vim/bundle/L9,~/.vim/bundle/aarons,~/.vim/bundle/ctrlp,~/.vim/bundle/easymotion,~/.vim/bundle/handlebars,~/.vim/bundle/matchit,~/.vim/bundle/matchtag,~/.vim/bundle/nerdtree,~/.vim/bundle/surround,~/.vim/bundle/tabular,~/.vim/bundle/tcomment,~/.vim/bundle/ultisnips,~/.vim/bundle/vim-autoclose,~/.vim/bundle/vim-coffee-script,~/.vim/bundle/vim-colors-solarized,~/.vim/bundle/vim-css3-syntax,~/.vim/bundle/vim-fugitive,~/.vim/bundle/vim-javascript-syntax,~/.vim/bundle/vim-less,~/.vim/bundle/vim-powerline,~/.vim/bundle/vim-qsearch,~/.vim/bundle/vim-sparkup,~/.vim/bundle/vim-supertab,/var/lib/vim/addons,/usr/share/vim/vimfiles,/usr/share/vim/vim73,/usr/share/vim/vimfiles/after,/var/lib/vim/addons/after,~/.vim/bundle/aarons/after,~/.vim/bundle/tabular/after,~/.vim/bundle/ultisnips/after,~/.vim/bundle/vim-coffee-script/after,~/.vim/bundle/vim-css3-syntax/after,~/.vim/after
set scrolloff=7
set sessionoptions=buffers,folds,options,tabpages,winsize
set shiftround
set shiftwidth=2
set showmatch
set noshowmode
set showtabline=2
set softtabstop=2
set suffixes=.bak,~,.swp,.o,.info,.aux,.log,.dvi,.bbl,.blg,.brf,.cb,.ind,.idx,.ilg,.inx,.out,.toc
set noswapfile
set switchbuf=usetab,newtab
set tabstop=2
set termencoding=utf-8
set title
set visualbell
set wildignore=*.swp,*.bak,*.class
set wildmenu
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +0 ~/development/asteroids/scripts/app/ship.js
badd +0 ~/development/asteroids/scripts/lib/Box2D.js
badd +0 ~/development/asteroids/scripts/app/actor.js
badd +0 ~/development/asteroids/scripts/app/physics.js
badd +0 ~/development/asteroids/index.html
badd +0 ~/development/asteroids/scripts/app/game.js
badd +0 ~/development/asteroids/scripts/app/stage.js
silent! argdel *
edit ~/development/asteroids/scripts/app/ship.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
xnoremap <buffer> <silent>  a} `>a}`<i{
xnoremap <buffer> <silent>  a{ `>a}`<i{
xnoremap <buffer> <silent>  a) `>a)`<i(
xnoremap <buffer> <silent>  a( `>a)`<i(
xnoremap <buffer> <silent>  a' `>a'`<i'
xnoremap <buffer> <silent>  a] `>a]`<i[
xnoremap <buffer> <silent>  a[ `>a]`<i[
xnoremap <buffer> <silent>  a" `>a"`<i"
xnoremap <buffer> <silent>  a` `>a``<i`
let s:cpo_save=&cpo
set cpo&vim
nnoremap <buffer> <silent> <F9> :call JSLint()
let &cpo=s:cpo_save
unlet s:cpo_save
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=sO:*\ -,mO:*\ \ ,exO:*/,s1:/*,mb:*,ex:*/,://
setlocal commentstring=//%s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal copyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=croql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=javascriptcomplete#CompleteJS
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#Statusline(0,0)
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 43 - ((11 * winheight(0) + 21) / 43)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
43
normal! 039l
tabedit ~/development/asteroids/scripts/app/actor.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
xnoremap <buffer> <silent>  a} `>a}`<i{
xnoremap <buffer> <silent>  a{ `>a}`<i{
xnoremap <buffer> <silent>  a) `>a)`<i(
xnoremap <buffer> <silent>  a( `>a)`<i(
xnoremap <buffer> <silent>  a' `>a'`<i'
xnoremap <buffer> <silent>  a] `>a]`<i[
xnoremap <buffer> <silent>  a[ `>a]`<i[
xnoremap <buffer> <silent>  a" `>a"`<i"
xnoremap <buffer> <silent>  a` `>a``<i`
let s:cpo_save=&cpo
set cpo&vim
nnoremap <buffer> <silent> <F9> :call JSLint()
let &cpo=s:cpo_save
unlet s:cpo_save
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=sO:*\ -,mO:*\ \ ,exO:*/,s1:/*,mb:*,ex:*/,://
setlocal commentstring=//%s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal copyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=croql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=javascriptcomplete#CompleteJS
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#Statusline(0,0)
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 32 - ((22 * winheight(0) + 21) / 43)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
32
normal! 042l
tabedit ~/development/asteroids/scripts/app/physics.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
xnoremap <buffer> <silent>  a} `>a}`<i{
xnoremap <buffer> <silent>  a{ `>a}`<i{
xnoremap <buffer> <silent>  a) `>a)`<i(
xnoremap <buffer> <silent>  a( `>a)`<i(
xnoremap <buffer> <silent>  a' `>a'`<i'
xnoremap <buffer> <silent>  a] `>a]`<i[
xnoremap <buffer> <silent>  a[ `>a]`<i[
xnoremap <buffer> <silent>  a" `>a"`<i"
xnoremap <buffer> <silent>  a` `>a``<i`
let s:cpo_save=&cpo
set cpo&vim
nnoremap <buffer> <silent> <F9> :call JSLint()
let &cpo=s:cpo_save
unlet s:cpo_save
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=sO:*\ -,mO:*\ \ ,exO:*/,s1:/*,mb:*,ex:*/,://
setlocal commentstring=//%s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal copyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=croql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=javascriptcomplete#CompleteJS
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#Statusline(0,0)
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 141 - ((31 * winheight(0) + 21) / 43)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
141
normal! 039l
tabedit ~/development/asteroids/scripts/app/game.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
xnoremap <buffer> <silent>  a} `>a}`<i{
xnoremap <buffer> <silent>  a{ `>a}`<i{
xnoremap <buffer> <silent>  a) `>a)`<i(
xnoremap <buffer> <silent>  a( `>a)`<i(
xnoremap <buffer> <silent>  a' `>a'`<i'
xnoremap <buffer> <silent>  a] `>a]`<i[
xnoremap <buffer> <silent>  a[ `>a]`<i[
xnoremap <buffer> <silent>  a" `>a"`<i"
xnoremap <buffer> <silent>  a` `>a``<i`
let s:cpo_save=&cpo
set cpo&vim
nnoremap <buffer> <silent> <F9> :call JSLint()
let &cpo=s:cpo_save
unlet s:cpo_save
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=sO:*\ -,mO:*\ \ ,exO:*/,s1:/*,mb:*,ex:*/,://
setlocal commentstring=//%s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal copyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=croql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=javascriptcomplete#CompleteJS
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#Statusline(0,1)
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 24 - ((17 * winheight(0) + 21) / 43)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
24
normal! 039l
tabedit ~/development/asteroids/scripts/app/stage.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
xnoremap <buffer> <silent>  a} `>a}`<i{
xnoremap <buffer> <silent>  a{ `>a}`<i{
xnoremap <buffer> <silent>  a) `>a)`<i(
xnoremap <buffer> <silent>  a( `>a)`<i(
xnoremap <buffer> <silent>  a' `>a'`<i'
xnoremap <buffer> <silent>  a] `>a]`<i[
xnoremap <buffer> <silent>  a[ `>a]`<i[
xnoremap <buffer> <silent>  a" `>a"`<i"
xnoremap <buffer> <silent>  a` `>a``<i`
let s:cpo_save=&cpo
set cpo&vim
nnoremap <buffer> <silent> <F9> :call JSLint()
let &cpo=s:cpo_save
unlet s:cpo_save
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=sO:*\ -,mO:*\ \ ,exO:*/,s1:/*,mb:*,ex:*/,://
setlocal commentstring=//%s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal copyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=croql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=javascriptcomplete#CompleteJS
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#Statusline(0,0)
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 253 - ((25 * winheight(0) + 21) / 43)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
253
normal! 051l
tabedit ~/development/asteroids/index.html
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
xnoremap <buffer> <silent>  a} `>a}`<i{
xnoremap <buffer> <silent>  a{ `>a}`<i{
xnoremap <buffer> <silent>  a) `>a)`<i(
xnoremap <buffer> <silent>  a( `>a)`<i(
xnoremap <buffer> <silent>  a' `>a'`<i'
xnoremap <buffer> <silent>  a] `>a]`<i[
xnoremap <buffer> <silent>  a[ `>a]`<i[
xnoremap <buffer> <silent>  a" `>a"`<i"
xnoremap <buffer> <silent>  a` `>a``<i`
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s:<!--,m:\ \ \ \ ,e:-->
setlocal commentstring=<!--%s-->
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal copyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'xhtml'
setlocal filetype=xhtml
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:],<:>
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=htmlcomplete#CompleteTags
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#Statusline(0,0)
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'xhtml'
setlocal syntax=xhtml
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 12 - ((11 * winheight(0) + 21) / 43)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
12
normal! 0
tabedit ~/development/asteroids/scripts/lib/Box2D.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
xnoremap <buffer> <silent>  a} `>a}`<i{
xnoremap <buffer> <silent>  a{ `>a}`<i{
xnoremap <buffer> <silent>  a) `>a)`<i(
xnoremap <buffer> <silent>  a( `>a)`<i(
xnoremap <buffer> <silent>  a' `>a'`<i'
xnoremap <buffer> <silent>  a] `>a]`<i[
xnoremap <buffer> <silent>  a[ `>a]`<i[
xnoremap <buffer> <silent>  a" `>a"`<i"
xnoremap <buffer> <silent>  a` `>a``<i`
let s:cpo_save=&cpo
set cpo&vim
nnoremap <buffer> <silent> <F9> :call JSLint()
let &cpo=s:cpo_save
unlet s:cpo_save
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=sO:*\ -,mO:*\ \ ,exO:*/,s1:/*,mb:*,ex:*/,://
setlocal commentstring=//%s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal copyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=croql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=javascriptcomplete#CompleteJS
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#Statusline(0,0)
setlocal suffixesadd=
setlocal noswapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 4923 - ((22 * winheight(0) + 21) / 43)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
4923
normal! 021l
tabnext 4
if exists('s:wipebuf')
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
