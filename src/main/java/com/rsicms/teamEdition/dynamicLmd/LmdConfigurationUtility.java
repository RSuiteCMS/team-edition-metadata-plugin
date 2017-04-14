package com.rsicms.teamEdition.dynamicLmd;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.reallysi.rsuite.api.ElementMatchingCriteria;
import com.reallysi.rsuite.api.LayeredMetadataDefinition;
import com.reallysi.rsuite.api.RSuiteException;
import com.reallysi.rsuite.api.User;
import com.reallysi.rsuite.api.extensions.ExecutionContext;
import com.reallysi.rsuite.api.extensions.Plugin;
import com.reallysi.rsuite.api.system.UnmanagedDocumentManager;
import com.rsicms.pluginUtilities.XmlUtility;
import com.rsicms.pluginUtilities.types.ElementTypeMatchingCriteria;

public class LmdConfigurationUtility {
	private static final Log log = LogFactory.getLog(LmdConfigurationUtility.class);
	private ExecutionContext context;
	private Plugin plugin;
	
	public LmdConfigurationUtility(ExecutionContext context, Plugin plugin) {
		this.context = context;
		this.plugin = plugin;
	}
	
	public String prettyPrint(Element elem) throws TransformerException, UnsupportedEncodingException {
		TransformerFactory tf = TransformerFactory.newInstance();
	    Transformer transformer = tf.newTransformer();
	    transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
	    transformer.setOutputProperty(OutputKeys.METHOD, "xml");
	    transformer.setOutputProperty(OutputKeys.INDENT, "yes");
	    transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
	    transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
	    ByteArrayOutputStream baos = new ByteArrayOutputStream();
	    transformer.transform(new DOMSource(elem), new StreamResult(baos));
	    return baos.toString("utf-8");
	}
	public static final String LMD_CONFIG_TAG = "lmd-configuration";
	public Document getLmdConf() throws RSuiteException {
		UnmanagedDocumentManager udm = context.getRepositoryService().getUnmanagedDocumentManager(plugin.getId());
		Element doc = null;
		try {
			doc = udm.getByUri(LMD_CONFIG_TAG + ".xml");
		} catch (RSuiteException rse) { /*not found */ 
			udm.loadDocument(LMD_CONFIG_TAG + ".xml", "<" + LMD_CONFIG_TAG + "/>");
			doc = udm.getByUri(LMD_CONFIG_TAG + ".xml");
		}
		return doc.getOwnerDocument();
	}
	public void saveLmdConf(Element lmdConf) throws RSuiteException, IOException, TransformerException {
		UnmanagedDocumentManager udm = context.getRepositoryService().getUnmanagedDocumentManager("team-edition-metadata");
		udm.loadDocument(LMD_CONFIG_TAG + ".xml", lmdConf);
		generatePlugin();
		configureLmd();
	}
	public void generatePlugin() throws IOException, RSuiteException, TransformerException {
		Document conf = getLmdConf();		
		String pluginId = plugin.getId();
		File tmpPluginFile = File.createTempFile(plugin.getId(), ".zip", context.getRSuiteServerConfiguration().getTmpDir());
		File genPluginFile = new File(plugin.getLocation().getParentFile(), pluginId + "-lmd-config.jar");
		genPluginFile.delete();
		InputStream xslIs = plugin.getResourceAsStream("xslt/lmd-configuration.rsuite-plugin.xsl");
		Transformer xf = context.getXmlApiManager().getTransformerFactory().newTransformer(new StreamSource(xslIs));
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(tmpPluginFile));
		out.putNextEntry(new ZipEntry("rsuite-plugin.xml"));
		StreamResult result = new StreamResult(out);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		xf.setParameter("current-date", sdf.format(new Date()));
		xf.setParameter("plugin-id", pluginId);
		xf.transform(new DOMSource(conf), result);
		out.closeEntry();
		out.close();
		if (!genPluginFile.getParentFile().exists()) { genPluginFile.getParentFile().mkdirs(); }
		FileUtils.copyFile(tmpPluginFile, genPluginFile);
	}

	public void configureLmd() throws RSuiteException {
		XmlUtility xml = new XmlUtility(context);
		Document el = getLmdConf();
		User system = context.getAuthorizationService().getSystemUser();
		for (Node field : xml.getNodes(el, "/lmd-configuration/lmd-field")) {
			Element fieldDef = (Element) field; 
			List<String> values = new ArrayList<String>();
			List<ElementMatchingCriteria> elements = new ArrayList<ElementMatchingCriteria>();
			for (Node value : xml.getNodes(field, "./options/option")) {
				Element option = (Element) value;
				values.add(option.getAttribute("value"));
			}
			
			for (Node element: xml.getNodes(field, "./applies-to/elements")) {
				Element elCrit = (Element) element;
				String elm = elCrit.getAttribute("local-name");
				String ns = elCrit.getAttribute("namespace-uri");
				ElementMatchingCriteria emc;
				if (!StringUtils.isEmpty(ns)) {
					emc = ElementTypeMatchingCriteria.createForElementType(ns, elm); 
				} else {
					emc = ElementTypeMatchingCriteria.createForElementType(null, elm);
				}
				elements.add(emc);
			}
			
			if (xml.getNode(field, "./applies-to/containers") != null) {
				elements.add(ElementTypeMatchingCriteria.createForElementType(null, "rs_ca"));
				elements.add(ElementTypeMatchingCriteria.createForElementType(null, "rs_canode"));
			}
			if (xml.getNode(field, "./applies-to/files") != null) {
				elements.add(ElementTypeMatchingCriteria.createForElementType(null, "nonxml"));
			}
			String lmdName = fieldDef.getAttribute("name");
			LayeredMetadataDefinition lmdDef = context.getMetaDataService().getLayeredMetaDataDefinition(system, lmdName);
			if (lmdDef != null) {
				context.getMetaDataService().removeLayeredMetaDataDefinition(system, lmdName);
			}
			context.getMetaDataService().createLayeredMetaDataDefinition(
				system,
				lmdName,
				"string", 
				Boolean.valueOf(fieldDef.getAttribute("versioned")),
				Boolean.valueOf(fieldDef.getAttribute("allow-multiple")),
				Boolean.valueOf(fieldDef.getAttribute("contextual")),
				elements,
				values.toArray(new String[0])
			);
			context.getMetaDataService().setLayeredMetaDataDefinitionElementCriteria(system, lmdName, elements);
		}
	}
}
