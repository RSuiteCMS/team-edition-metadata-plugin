package com.rsicms.teamEdition.dynamicLmd.api;

import org.apache.commons.fileupload.FileItem;
import org.w3c.dom.Document;

import com.reallysi.rsuite.api.User;
import com.reallysi.rsuite.api.remoteapi.RemoteApiResult;
import com.reallysi.rsuite.api.remoteapi.result.XmlRemoteApiResult;
import com.rsicms.pluginUtilities.SimpleRemoteApiHandler;
import com.rsicms.pluginUtilities.XmlUtility;
import com.rsicms.teamEdition.TESecurityUtility;
import com.rsicms.teamEdition.dynamicLmd.LmdConfigurationUtility;

public class LmdConfig extends SimpleRemoteApiHandler {

	@Override
	public RemoteApiResult execute() throws Throwable {
		Document config = null;
		FileItem fi;
		String configText; 
		XmlUtility xmlUtil = new XmlUtility(context);
		LmdConfigurationUtility lmdUtil = new LmdConfigurationUtility(context, plugin);
		Document doc = null;
		byte[] xmlBytes = null;
		User user = context.getSession().getUser();
		if (null != (fi = arguments.getFirstFile("config"))) {
			xmlBytes = fi.get();
		} else if (null != (configText = arguments.getFirstString("config"))) {
			xmlBytes = configText.getBytes("utf-8");
		}
		if (xmlBytes != null && TESecurityUtility.userIsTEAdmin(context.getSession().getUser())) {
			doc = xmlUtil.parse(xmlBytes);
			lmdUtil.saveLmdConf(doc.getDocumentElement());
		}
		config = lmdUtil.getLmdConf();
		return new XmlRemoteApiResult(config);
	}


}
