
ALTER TABLE public.co_tool_flows DROP CONSTRAINT co_tool_flows_tool_origem_id_fkey;
ALTER TABLE public.co_tool_flows DROP CONSTRAINT co_tool_flows_tool_destino_id_fkey;
ALTER TABLE public.co_tool_flows ADD CONSTRAINT co_tool_flows_tool_origem_id_fkey FOREIGN KEY (tool_origem_id) REFERENCES public.tools(id) ON DELETE CASCADE;
ALTER TABLE public.co_tool_flows ADD CONSTRAINT co_tool_flows_tool_destino_id_fkey FOREIGN KEY (tool_destino_id) REFERENCES public.tools(id) ON DELETE CASCADE;
