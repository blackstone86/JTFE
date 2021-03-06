var _tpl = 
`<div class="ganttTaskEditor">
    <h2 class="taskData">Task editor</h2>
    <table cellspacing="1" cellpadding="5" width="100%" class="taskData table" border="0">
        <tr>
            <td width="200" style="height: 80px"  valign="top">
            <label for="code">code/short name</label><br>
            <input type="text" name="code" id="code" value="" size=15 class="formElements" autocomplete='off' maxlength=255 style='width:100%' oldvalue="1">
            </td>
            <td colspan="3" valign="top"><label for="name" class="required">name</label><br><input type="text" name="name" id="name"class="formElements" autocomplete='off' maxlength=255 style='width:100%' value="" required="true" oldvalue="1"></td>
        </tr>

        <tr class="dateRow">
            <td nowrap="">
                <div style="position:relative">
                    <label for="start">start</label>&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="checkbox" id="startIsMilestone" name="startIsMilestone" value="yes"> &nbsp;<label for="startIsMilestone">is milestone</label>&nbsp;
                    <br><input type="text" name="start" id="start" size="8" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
                    <span title="calendar" id="starts_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span>          
                </div>
            </td>
            <td nowrap="">
                <label for="end">End</label>&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="checkbox" id="endIsMilestone" name="endIsMilestone" value="yes"> &nbsp;<label for="endIsMilestone">is milestone</label>&nbsp;
                <br><input type="text" name="end" id="end" size="8" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
                <span title="calendar" id="ends_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span>
            </td>
            <td nowrap="" >
                <label for="duration" class=" ">Days</label><br>
                <input type="text" name="duration" id="duration" size="4" class="formElements validated durationdays" title="Duration is in working days." autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DURATIONDAYS">&nbsp;
            </td>
        </tr>

        <tr>
            <td  colspan="2">
            <label for="status" class=" ">status</label><br>
            <select id="status" name="status" class="taskStatus" status="(#=obj.status#)"  onchange="$(this).attr('STATUS',$(this).val());">
                <option value="STATUS_ACTIVE" class="taskStatus" status="STATUS_ACTIVE" >active</option>
                <option value="STATUS_SUSPENDED" class="taskStatus" status="STATUS_SUSPENDED" >suspended</option>
                <option value="STATUS_DONE" class="taskStatus" status="STATUS_DONE" >completed</option>
                <option value="STATUS_FAILED" class="taskStatus" status="STATUS_FAILED" >failed</option>
                <option value="STATUS_UNDEFINED" class="taskStatus" status="STATUS_UNDEFINED" >undefined</option>
            </select>
            </td>

            <td valign="top" nowrap>
                <label>progress</label><br>
                <input type="text" name="progress" id="progress" size="7" class="formElements validated percentile" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="PERCENTILE">
            </td>
        </tr>

        <tr>
            <td colspan="4">
                <label for="description">Description</label><br>
                <textarea rows="3" cols="30" id="description" name="description" class="formElements" style="width:100%"></textarea>
            </td>
        </tr>
    </table>

    <h2>Assignments</h2>
    <table  cellspacing="1" cellpadding="0" width="100%" id="assigsTable">
        <tr>
            <th style="width:100px;">name</th>
            <th style="width:70px;">Role</th>
            <th style="width:30px;">est.wklg.</th>
            <th style="width:30px;" id="addAssig"><span class="teamworkIcon" style="cursor: pointer">+</span></th>
        </tr>
    </table>

    <div style="text-align: right; padding-top: 20px">
        <span id="saveButton" class="button first" onClick="$(this).trigger('saveFullEditor.gantt');">Save</span>
    </div>
</div>`
module.exports = _tpl;