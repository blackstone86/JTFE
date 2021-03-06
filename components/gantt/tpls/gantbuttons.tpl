var _tpl = 
`<div class="ganttButtonBar noprint">
    <div class="buttons">
        <button onclick="ge.workSpace.trigger('undo.gantt');return false;" class="button textual icon requireCanWrite" title="undo"><span class="teamworkIcon">&#39;</span></button>
        <button onclick="ge.workSpace.trigger('redo.gantt');return false;" class="button textual icon requireCanWrite" title="redo"><span class="teamworkIcon">&middot;</span></button>
        <span class="ganttButtonSeparator requireCanWrite requireCanAdd"></span>
        <button onclick="ge.workSpace.trigger('addAboveCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert above"><span class="teamworkIcon">l</span></button>
        <button onclick="ge.workSpace.trigger('addBelowCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert below"><span class="teamworkIcon">X</span></button>
        <span class="ganttButtonSeparator requireCanWrite requireCanInOutdent"></span>
        <button onclick="ge.workSpace.trigger('outdentCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanInOutdent" title="un-indent task"><span class="teamworkIcon">.</span></button>
        <button onclick="ge.workSpace.trigger('indentCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanInOutdent" title="indent task"><span class="teamworkIcon">:</span></button>
        <span class="ganttButtonSeparator requireCanWrite requireCanMoveUpDown"></span>
        <button onclick="ge.workSpace.trigger('moveUpCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanMoveUpDown" title="move up"><span class="teamworkIcon">k</span></button>
        <button onclick="ge.workSpace.trigger('moveDownCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanMoveUpDown" title="move down"><span class="teamworkIcon">j</span></button>
        <span class="ganttButtonSeparator requireCanDelete"></span>
        <button onclick="ge.workSpace.trigger('deleteFocused.gantt');return false;" class="button textual icon delete requireCanWrite" title="Delete"><span class="teamworkIcon">&cent;</span></button>
        <span class="ganttButtonSeparator"></span>
        <button onclick="ge.workSpace.trigger('expandAll.gantt');return false;" class="button textual icon " title="EXPAND_ALL"><span class="teamworkIcon">6</span></button>
        <button onclick="ge.workSpace.trigger('collapseAll.gantt'); return false;" class="button textual icon " title="COLLAPSE_ALL"><span class="teamworkIcon">5</span></button>

        <span class="ganttButtonSeparator"></span>
        <button onclick="ge.workSpace.trigger('zoomMinus.gantt'); return false;" class="button textual icon " title="zoom out"><span class="teamworkIcon">)</span></button>
        <button onclick="ge.workSpace.trigger('zoomPlus.gantt');return false;" class="button textual icon " title="zoom in"><span class="teamworkIcon">(</span></button>
        <span class="ganttButtonSeparator"></span>
        <button onclick="print();return false;" class="button textual icon " title="Print"><span class="teamworkIcon">p</span></button>
        <span class="ganttButtonSeparator"></span>
        <button onclick="ge.gantt.showCriticalPath=!ge.gantt.showCriticalPath; ge.redraw();return false;" class="button textual icon requireCanSeeCriticalPath" title="CRITICAL_PATH"><span class="teamworkIcon">&pound;</span></button>
        <span class="ganttButtonSeparator requireCanSeeCriticalPath"></span>
        <button onclick="ge.splitter.resize(.1);return false;" class="button textual icon" ><span class="teamworkIcon">F</span></button>
        <button onclick="ge.splitter.resize(50);return false;" class="button textual icon" ><span class="teamworkIcon">O</span></button>
        <button onclick="ge.splitter.resize(100);return false;" class="button textual icon"><span class="teamworkIcon">R</span></button>
        <span class="ganttButtonSeparator"></span>
        <button onclick="ge.workSpace.trigger('fullScreen.gantt');return false;" class="button textual icon" title="FULLSCREEN" id="fullscrbtn"><span class="teamworkIcon">@</span></button>
        <button onclick="ge.element.toggleClass('colorByStatus' );return false;" class="button textual icon"><span class="teamworkIcon">&sect;</span></button>

        <button onclick="_ge.editResources();" class="button textual requireWrite" title="edit resources"><span class="teamworkIcon">M</span></button>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <button onclick="_ge.saveGanttOnServer();" class="button first big requireWrite" title="Save">保存</button>
        <button onclick='_ge.newProject();' class='button requireWrite newproject'>清空项目</button>
    </div>
</div>`
module.exports = _tpl;