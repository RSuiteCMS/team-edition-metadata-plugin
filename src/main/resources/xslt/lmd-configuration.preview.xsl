<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output
        method="html"
        omit-xml-declaration="yes"
        encoding="UTF-8"
        indent="yes" />    
    <xsl:template match="/">
        <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html>&#x0D;</xsl:text>
        <html>
            <head>
                <title> </title>
                <meta charset="UTF-8" />
                <style type="text/css">
                    body {
                    }
                    td { text-align: center;}
                    td.long { text-align: left;}
                    ul {
                        list-style-type: none;
                    }
                    ul li {
                        display: inline;
                    }
                    ul li::after {
                        content: ', ';
                    }
                    ul li:last-child::after {
                        content: '';
                    }
                </style>
            </head>
            <body>
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="lmd-configuration">
        <h2>LMD definitions</h2>
        <table>
            <thead>
                <tr>
                    <th>name</th>
                    <th>label</th>
                    <th>Contextual</th>
                    <th>Versionable</th>
                    <th>Multiple</th>
                    <th>Control Type</th>
                    <th>values</th>
                    <th>elements</th>
                </tr>
            </thead>
            <tbody>
                <xsl:apply-templates select="lmd-field"/>
            </tbody>
        </table>
        <h2>LMD Faceted Search</h2>
        <ul>
            <xsl:apply-templates select="lmd-search" />
        </ul>
        <h2>LMD Editors</h2>
        <ul>
            <xsl:apply-templates select="lmd-search" />
        </ul>
    </xsl:template>
    <xsl:template match="lmd-field">
        <tr>
            <td><xsl:value-of select="@name"/></td>
            <td><xsl:value-of select="@label"/></td>
            <td><xsl:choose><xsl:when test="@contextual">&#x2611;</xsl:when><xsl:otherwise>&#x2610;</xsl:otherwise></xsl:choose></td>
            <td><xsl:choose><xsl:when test="@versioned">&#x2611;</xsl:when><xsl:otherwise>&#x2610;</xsl:otherwise></xsl:choose></td>
            <td><xsl:choose><xsl:when test="@allow-multiple">&#x2611;</xsl:when><xsl:otherwise>&#x2610;</xsl:otherwise></xsl:choose></td>
            <td><xsl:choose><xsl:when test="@control-type">&#x2611;</xsl:when><xsl:otherwise>&#x2610;</xsl:otherwise></xsl:choose></td>
            <td>
                <ul>
                    <xsl:apply-templates select="value" />
                </ul>
            </td>
            <td>
                <ul>
                    <xsl:apply-templates select="element" />                    
                </ul>
            </td>
        </tr>
    </xsl:template>
    <xsl:template match="value">
        <li><xsl:value-of select="." /></li>
    </xsl:template>
    <xsl:template match="element">
        <li><xsl:value-of select="." /></li>
    </xsl:template>
    <xsl:template match="lmd-search">
        <li><xsl:value-of select="@label" /> (<xsl:value-of select="@name" />)</li>
    </xsl:template>
    <xsl:template match="lmd-edit">
        <li><xsl:value-of select="@label" /> (<xsl:value-of select="@name" />)</li>
    </xsl:template>
</xsl:stylesheet>
